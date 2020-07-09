const knex = require('knex')
const app = require('../src/app')
const { makeRoutesArray, makeMaliciousRoute } = require('./routes.fixtures')
const { makeRouteTypesArray } = require('./routeTypes.fixtures')
const { makeLocationsArray } = require('./locations.fixtures')

describe('Routes Endpoints', function() {
  let db

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)

  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE route_type, locations, routes, destinations RESTART IDENTITY CASCADE'))

  afterEach('cleanup',() => db.raw('TRUNCATE route_type, locations, routes, destinations RESTART IDENTITY CASCADE'))

  describe(`GET /api/routes`, () => {
    context(`Given no routes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/routes')
          .expect(200, [])
      })
    })

    context('Given there are routes in the database', () => {
      const testRouteTypes = makeRouteTypesArray();
      const testLocations = makeLocationsArray();
      const testRoutes = makeRoutesArray();

      beforeEach('insert routes', () => {
        return db
          .into('route_type')
          .insert(testRouteTypes)
          .then(() => {
              return db
                .into('locations')
                .insert(testLocations)
          })
          .then(() => {
            return db
              .into('routes')
              .insert(testRoutes)
          })
      })

      it('responds with 200 and all of the routes', () => {
        return supertest(app)
          .get('/api/routes')
          .expect(200, testRoutes)
      })
    })

    context(`Given an XSS attack routes`, () => {
      const testRouteTypes = makeRouteTypesArray();
      const testLocations = makeLocationsArray();
      const { maliciousRoute, expectedRoute } = makeMaliciousRoute()

      beforeEach('insert malicious route', () => {
        return db
          .into('route_type')
          .insert(testRouteTypes)
          .then(() => {
            return db
            .into('locations')
            .insert(testLocations)
          })
          .then(() => {
            return db
              .into('routes')
              .insert([ maliciousRoute ])
          })
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/routes`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].route_name).to.eql(expectedRoute.route_name)
            expect(res.body[0].route_summ).to.eql(expectedRoute.route_summ)
          })
      })
    })
  })

  describe(`GET /api/routes/:route_id`, () => {
    context(`Given no routes`, () => {
      it(`responds with 404`, () => {
        const routeId = 123456
        return supertest(app)
          .get(`/api/routes/${routeId}`)
          .expect(404, { error: { message: `Route doesn't exist` } })
      })
    })

    context('Given there are routes in the database', () => {
      const testRouteTypes = makeRouteTypesArray();
      const testLocations = makeLocationsArray();
      const testRoutes = makeRoutesArray()

      beforeEach('insert routes', () => {
        return db
          .into('route_type')
          .insert(testRouteTypes)
          .then(() => {
              return db
                .into('locations')
                .insert(testLocations)
          })
          .then(() => {
            return db
              .into('routes')
              .insert(testRoutes)
          })
      })

      it('responds with 200 and the specified route', () => {
        const routeId = 2
        const expectedRoute = testRoutes[routeId - 1]
        return supertest(app)
          .get(`/api/routes/${routeId}`)
          .expect(200, expectedRoute)
      })
    })

    context(`Given an XSS attack content`, () => {
      const testRouteTypes = makeRouteTypesArray();
      const testLocations = makeLocationsArray();
      const { maliciousRoute, expectedRoute } = makeMaliciousRoute()

      beforeEach('insert malicious route', () => {
        return db
          .into('route_type')
          .insert(testRouteTypes)
          .then(() => {
              return db
                .into('locations')
                .insert(testLocations)
          })
          .then(() => {
            return db
              .into('routes')
              .insert([ maliciousRoute ])
          })
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/routes/${maliciousRoute.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.route_name).to.eql(expectedRoute.route_name)
            expect(res.body.route_summ).to.eql(expectedRoute.route_summ)
          })
      })
    })
  })

  describe(`POST /api/routes`, () => {
    const testRouteTypes = makeRouteTypesArray();
    const testLocations = makeLocationsArray();

    beforeEach('insert route types and locations', () => {
      return db
        .into('route_type')
        .insert(testRouteTypes)
        .then(() => {
            return db
                .into('locations')
                .insert(testLocations)
        })
    })

    it(`creates a route, responding with 201 and the new route`, () => {
      const newRoute = {
        route_name: 'Test new route',
        route_summ: 'Test new nroute content...',
        route_type_id: 2,
        location_id: 1
      }
      return supertest(app)
        .post('/api/routes')
        .send(newRoute)
        .expect(201)
        .expect(res => {
          expect(res.body.route_name).to.eql(newRoute.route_name)
          expect(res.body.route_summ).to.eql(newRoute.route_summ)
          expect(res.body.route_type_id).to.eql(newRoute.route_type_id)
          expect(res.body.location_id).to.eql(newRoute.location_id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/routes/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/routes/${res.body.id}`)
            .expect(res.body)
        )
    })

    const requiredFields = ['route_name', 'route_summ', 'route_type_id', 'location_id']

    requiredFields.forEach(field => {
        const newRoute = {
            route_name: 'Test new route',
            route_summ: 'Test new nroute content...',
            route_type_id: 2,
            location_id: 1
        }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newRoute[field]

        return supertest(app)
          .post('/api/routes')
          .send(newRoute)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

    it('removes XSS attack content from response', () => {
      const { maliciousRoute, expectedRoute } = makeMaliciousRoute()
      return supertest(app)
        .post(`/api/routes`)
        .send(maliciousRoute)
        .expect(201)
        .expect(res => {
          expect(res.body.route_name).to.eql(expectedRoute.route_name)
          expect(res.body.route_summ).to.eql(expectedRoute.route_summ)
          expect(res.body.route_type_id).to.eql(expectedRoute.route_type_id)
          expect(res.body.location_id).to.eql(expectedRoute.location_id)
        })
    })
  })

  describe(`DELETE /api/routes/:route_id`, () => {
    context(`Given no routes`, () => {
      it(`responds with 404`, () => {
        const routeId = 123456
        return supertest(app)
          .delete(`/api/routes/${routeId}`)
          .expect(404, { error: { message: `Route doesn't exist` } })
      })
    })

    context('Given there are routes in the database', () => {
      const testRouteTypes = makeRouteTypesArray();
      const testLocations = makeLocationsArray();
      const testRoutes = makeRoutesArray();

      beforeEach('insert routes', () => {
        return db
          .into('route_type')
          .insert(testRouteTypes)
          .then(() => {
              return db 
                .into('locations')
                .insert(testLocations)
          })
          .then(() => {
            return db
              .into('routes')
              .insert(testRoutes)
          })
      })

      it('responds with 204 and removes the route', () => {
        const idToRemove = 2
        const expectedRoutes = testRoutes.filter(route => route.id !== idToRemove)
        return supertest(app)
          .delete(`/api/routes/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/routes`)
              .expect(expectedRoutes)
          )
      })
    })
  })

  describe(`PATCH /api/routes/:route_id`, () => {
    context(`Given no notes`, () => {
      it(`responds with 404`, () => {
        const routeId = 123456
        return supertest(app)
          .delete(`/api/routes/${routeId}`)
          .expect(404, { error: { message: `Route doesn't exist` } })
      })
    })

    context('Given there are routes in the database', () => {
      const testRouteTypes = makeRouteTypesArray();
      const testLocations = makeLocationsArray();
      const testRoutes = makeRoutesArray();

      beforeEach('insert routes', () => {
        return db
          .into('route_type')
          .insert(testRouteTypes)
          .then(() => {
              return db
                .into('locations')
                .insert(testLocations)
          })
          .then(() => {
            return db
              .into('routes')
              .insert(testRoutes)
          })
      })

      it('responds with 204 and updates the route', () => {
        const idToUpdate = 2
        const updateRoute = {
          route_name: 'updated route title',
          route_summ: 'updated route summary',
          route_type_id: 1,
          location_id: 1
        }
        const expectedRoute = {
          ...testRoutes[idToUpdate - 1],
          ...updateRoute
        }
        return supertest(app)
          .patch(`/api/routes/${idToUpdate}`)
          .send(updateRoute)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/routes/${idToUpdate}`)
              .expect(expectedRoute)
          )
      })

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/routes/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a route name, summary, route type, and location`
            }
          })
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateRoute = {
          route_name: 'updated route title',
        }
        const expectedRoute = {
          ...testRoutes[idToUpdate - 1],
          ...updateRoute
        }

        return supertest(app)
          .patch(`/api/routes/${idToUpdate}`)
          .send({
            ...updateRoute,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/routes/${idToUpdate}`)
              .expect(expectedRoute)
          )
      })
    })
    })
})