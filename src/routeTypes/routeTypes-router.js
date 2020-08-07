const express = require('express');
const xss = require('xss');
const path = require('path');
const RouteTypesService = require('./routeTypes-service');

const routeTypesRouter = express.Router();
const jsonParser = express.json();

const serializeRouteType = routeType => ({
  id: routeType.id,
  route_type: xss(routeType.route_type),
});

routeTypesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    RouteTypesService.getAllRouteTypes(knexInstance)
      .then(routeTypes => {
        res.json(routeTypes.map(serializeRouteType))
      })
      .catch(next)
});

module.exports = routeTypesRouter;