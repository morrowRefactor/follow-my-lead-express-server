require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const routeTypesRouter = require('./routeTypes/routeTypes-router');
const locationsRouter = require('./locations/locations-router');
const routesRouter = require('./routes/routes-router');
const destinationsRouter = require('./destinations/destinations-router');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}));

app.use(helmet());
app.use(cors());


app.use('/api/route-types', routeTypesRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/routes', routesRouter);
app.use('/api/destinations', destinationsRouter);


app.get('/', (req, res) => {
  res.send('Hello, World!')
});

app.use(function errorHandler(error, req, res, next) {
   let response
   if (NODE_ENV === 'production') {
   response = { error: { message: 'server error' } }
     } else {
     console.error(error)
     response = { message: error.message, error }
   }
   res.status(500).json(response)
});

module.exports = app;