const express = require('express');
const xss = require('xss');
const path = require('path');
const LocationsService = require('./locations-service');

const locationsRouter = express.Router();
const jsonParser = express.json();

const serializeLocations = location => ({
  id: location.id,
  city: xss(location.city),
  state_province: xss(location.state_province),
  country: xss(location.country),
  unique_loc: xss(location.unique_loc)
});

locationsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    LocationsService.getAllLocations(knexInstance)
      .then(locations => {
        res.json(locations.map(serializeLocations))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { city, state_province, country, unique_loc } = req.body;
    const newLocation = { city, state_province, country, unique_loc };

    for (const [key, value] of Object.entries(newLocation))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
      });
    LocationsService.insertLocation(
      req.app.get('db'),
      newLocation
    )
      .then(loc => {
        console.log(loc, serializeLocations(loc));
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${loc.id}`))
          .json(serializeLocations(loc))
      })
      .catch(next)
});

module.exports = locationsRouter;