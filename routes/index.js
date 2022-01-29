const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/../proto/gtfs-realtime.proto';
const API_KEY = 'dKCTzqLlDw8nrx5ZcQfM73vkNqdoxIQPazUtoGVo';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const transitProto = grpc.loadPackageDefinition(packageDefinition).transit_realtime;

const metadata = new grpc.Metadata();
metadata.add('x-api-key', API_KEY);
const credentials = grpc.credentials.createFromMetadataGenerator(metadata);
// console.log(transitProto.FeedMessage)
// const client = new transitProto.VehicleDescriptor('https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm', credentials);

const express = require('express');
const axios = require('axios');
const res = require('express/lib/response');

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
      headers: {
        'x-api-key': API_KEY,
      },
    });

    console.log(response.data)
  } catch (error) {
    return res.status(400).send({ error });
  }

  res.send('home page');
});

router.get('/about', (req, res) => {
  res.send('About us');
});

module.exports = router;