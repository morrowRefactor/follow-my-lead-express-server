const express = require('express')
const xss = require('xss')
const path = require('path')
const RoutesService = require('./routes-service')

const routesRouter = express.Router()
const jsonParser = express.json()

const serializeRoutes = route => ({
  id: route.id,
  route_name: xss(route.route_name),
  route_summ: xss(route.route_summ),
  route_type_id: route.route_type_id,
  location_id: route.location_id
})

routesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    RoutesService.getAllRoutes(knexInstance)
      .then(routes => {
        res.json(routes.map(serializeRoutes))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { route_name, route_summ, route_type_id, location_id } = req.body
    const newRoute = { route_name, route_summ, route_type_id, location_id }

    for (const [key, value] of Object.entries(newRoute))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    RoutesService.insertRoute(
      req.app.get('db'),
      newRoute
    )
      .then(route => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${route.id}`))
          .json(serializeRoutes(route))
      })
      .catch(next)
  })

routesRouter
  .route('/:route_id')
  .all((req, res, next) => {
    RoutesService.getById(
      req.app.get('db'),
      req.params.route_id
    )
      .then(route => {
        if (!route) {
          return res.status(404).json({
            error: { message: `Route doesn't exist` }
          })
        }
        res.route = route
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeRoutes(res.route))
  })
  .delete((req, res, next) => {
    RoutesService.deleteRoute(
      req.app.get('db'),
      req.params.route_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { route_name, route_summ, route_type_id, location_id } = req.body
    const routeToUpdate = { route_name, route_summ, route_type_id, location_id }

    const numberOfValues = Object.values(routeToUpdate).filter(Boolean).length
      if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a route name, summary, route type, and location`
        }
      })
    }

    RoutesService.updateRoute(
        req.app.get('db'),
        req.params.route_id,
        routeToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = routesRouter