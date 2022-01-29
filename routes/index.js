const path = require('path');
const express = require('express');
const axios = require('axios');
const protobuf = require("protobufjs");

const nyctSubwayProtoRoot = protobuf.loadSync(path.join(__dirname, '../proto/nyct-subway.proto'));
const FeedMessage = nyctSubwayProtoRoot.lookupType("transit_realtime.FeedMessage");

const router = express.Router();

router.use((req, res, next) => {
  const now = new Date();
  console.log(`${now.toLocaleString()}:`, `method=${req.method}`, `path=${req.url}`);
  next();
});

router.get('/', async (req, res) => {
  try {
    const response = await axios({
      method: 'get',
      url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm',
      responseType: 'arraybuffer',
      headers: {
        'x-api-key': process.env.MTA_API_KEY,
      },
    });

    console.log("Received a response!")
    const responseData = response.data;

    const decoded = FeedMessage.decode(new Uint8Array(responseData));
    console.log(decoded.entity)
  } catch (error) {
    console.log("Error processing request", error);
    return res.status(400).send({ error });
  }

  res.send('home page');
});

router.get('/about', (req, res) => {
  res.send('About us');
});

module.exports = router;