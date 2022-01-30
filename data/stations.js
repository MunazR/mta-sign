const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync').parse;

const file = fs.readFileSync(path.resolve(__dirname, 'stations.csv'));
const data = parse(file.toString(), { columns: true, skip_empty_lines: true });

const getStationData = (stopId) => data.find((station) => station['GTFS Stop ID'] === stopId);

module.exports = {
  getStationData,
};