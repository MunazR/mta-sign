const path = require('path');
const express = require('express');
const axios = require('axios');
const protobuf = require("protobufjs");
const { getStationData } = require("../data/stations");

const nyctSubwayProtoRoot = protobuf.loadSync(path.join(__dirname, '../proto/nyct-subway.proto'));
const FeedMessage = nyctSubwayProtoRoot.lookupType("transit_realtime.FeedMessage");

const stationIds = process.env.GTFS_STOPS.split(',');
const stationData = stationIds
  .map(getStationData)
  .reduce((result, station) => ({ ...result, [station['GTFS Stop ID']]: station, }), {});

const feeds = process.env.FEEDS.split(',');

const router = express.Router();

router.use((req, res, next) => {
  const now = new Date();
  console.log(`${now.toLocaleString()}:`, `method=${req.method}`, `path=${req.url}`);
  next();
});

router.get('/data', async (req, res) => {
  try {
    const updatesForStation = await Promise.all(feeds.map(async (feed) => {
      const response = await axios({
        method: 'get',
        url: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-${feed}`,
        responseType: 'arraybuffer',
        headers: {
          'x-api-key': process.env.MTA_API_KEY,
        },
      });

      const feedMessage = FeedMessage.toObject(
        FeedMessage.decode(Buffer.from(response.data)),
        {
          longs: String,
          enums: String,
          bytes: String,
        },
      );

      return feedMessage.entity
        .map((entity) => {
          const { tripUpdate, id } = entity;
          if (!tripUpdate) {
            return;
          }

          const { stopTimeUpdate, trip } = tripUpdate;
          if (!stopTimeUpdate || !trip) {
            return;
          }

          const stop = stopTimeUpdate
            .find((update) => stationIds.some((id) => id === update.stopId.substring(0, 3)));

          if (!stop) {
            return;
          }

          return {
            id,
            arrivalTime: stop.arrival.time,
            stopId: stop.stopId,
            routeId: trip.routeId,
          };
        })
        .filter((update) => Boolean(update))
    }));

    const stopTimeUpdates = updatesForStation
      .flat()
      .sort((update1, update2) => update1.arrivalTime - update2.arrivalTime)
      .reduce((result, update) => {
        const stopId = update.stopId;
        return {
          ...result,
          [stopId]: [
            ...(result[stopId] ?? []),
            update,
          ],
        };
      }, {});

    return res.json({
      stations: stationData,
      stopTimeUpdates,
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get('/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios({
      method: 'get',
      url: `https://api.openweathermap.org/data/2.5/onecall`,
      params: {
        appid: process.env.WEATHER_API_KEY,
        units: 'metric',
        lat,
        lon,
      },
    });

    return res.json(response.data);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

module.exports = router;