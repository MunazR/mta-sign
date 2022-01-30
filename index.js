require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const cors = require('cors')

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(cors());
app.use(routes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});