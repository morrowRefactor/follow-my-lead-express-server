const express = require('express')
const xss = require('xss')
const path = require('path')
const DestinationsService = require('./destinations-service')

const destinationsRouter = express.Router()
const jsonParser = express.json()

const serializeDestinations = dest => ({
  id: dest.id,
  destination: xss(dest.destination),
  sequence_num: dest.sequence_num,
  content: xss(dest.content),
  route_id: dest.route_id,
  dest_address: dest.dest_address,
  dest_lat: dest.dest_lat,
  dest_lng: dest.dest_lng,
  place_id: dest.place_id,
  formatted_address: dest.formatted_address
})

destinationsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    DestinationsService.getAllDestinations(knexInstance)
      .then(dest => {
        res.json(dest.map(serializeDestinations))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { destination, sequence_num, content, route_id, dest_address, dest_lat, dest_lng, place_id, formatted_address } = req.body
    const newDest = { destination, sequence_num, content, route_id, dest_address, dest_lat, dest_lng, place_id, formatted_address }

    for (const [key, value] of Object.entries(newDest))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    DestinationsService.insertDestinations(
      req.app.get('db'),
      newDest
    )
      .then(dest => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${dest.id}`))
          .json(serializeDestinations(dest))
      })
      .catch(next)
  })

destinationsRouter
  .route('/:dest_id')
  .all((req, res, next) => {
    DestinationsService.getById(
      req.app.get('db'),
      req.params.dest_id
    )
      .then(dest => {
        if (!dest) {
          return res.status(404).json({
            error: { message: `Destination doesn't exist` }
          })
        }
        res.dest = dest
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeDestinations(res.dest))
  })
  .delete((req, res, next) => {
    DestinationsService.deleteDestination(
      req.app.get('db'),
      req.params.dest_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { destination, sequence_num, content, route_id, dest_address, dest_lat, dest_lng, place_id, formatted_address } = req.body
    const destToUpdate = { destination, sequence_num, content, route_id, dest_address, dest_lat, dest_lng, place_id, formatted_address }

    const numberOfValues = Object.values(destToUpdate).filter(Boolean).length
      if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
          message: `Request body must contain a destination, sequence number, and route ID`
        }
      })
    }

    DestinationsService.updateDestination(
        req.app.get('db'),
        req.params.dest_id,
        destToUpdate
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = destinationsRouter