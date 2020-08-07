const knex = require('knex');
const app = require('../src/app');
const { makeDestinationsArray, makeMaliciousDestination } = require('./destinations.fixtures');
const { makeRoutesArray } = require('./routes.fixtures');
const { makeRouteTypesArray } = require('./routeTypes.fixtures');
const { makeLocationsArray } = require('./locations.fixtures');
const routeTypesFixtures = require('./routeTypes.fixtures');

describe('Destinations Endpoints', function() {
  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);

  })

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE route_type, locations, routes, destinations RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE route_type, locations, routes, destinations RESTART IDENTITY CASCADE'));

  describe(`GET /api/destinations`, () => {
    context(`Given no destinations`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/destinations')
          .expect(200, [])
      })
    });

    context('Given there are destinations in the database', () => {
      const testDestinations = makeDestinationsArray();
      const testRouteTypes = makeRouteTypesArray();
      const testLocations = makeLocationsArray();
      const testRoutes = makeRoutesArray();

      beforeEach('insert destinations', () => {
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
          .then(() => {
            return db
              .into('destinations')
              .insert(testDestinations)
          })
      });

      it('responds with 200 and all of the destinations', () => {
        return supertest(app)
          .get('/api/destinations')
          .expect(200, testDestinations)
      });
    });

    context(`Given an XSS attack destination`, () => {
      const testRouteTypes = makeRouteTypesArray();
      const testLocations = makeLocationsArray();
      const testRoutes = makeRoutesArray();
      const { maliciousDestination, expectedDestination } = makeMaliciousDestination();

      beforeEach('insert malicious destination', () => {
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
          .then(() => {
            return db   
              .into('destinations')
              .insert([ maliciousDestination ])
          })
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/destinations`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].destination).to.eql(expectedDestination.destination)
            expect(res.body[0].sequence_num).to.eql(expectedDestination.sequence_num)
            expect(res.body[0].content).to.eql(expectedDestination.content)
            expect(res.body[0].route_id).to.eql(expectedDestination.route_id)
            expect(res.body[0].dest_address).to.eql(expectedDestination.dest_address)
            expect(res.body[0].dest_lat).to.eql(expectedDestination.dest_lat)
            expect(res.body[0].dest_lng).to.eql(expectedDestination.dest_lng)
            expect(res.body[0].place_id).to.eql(expectedDestination.place_id)
            expect(res.body[0].formatted_address).to.eql(expectedDestination.formatted_address)
          })
      });
    });
  });

  describe(`GET /api/destinations/:dest_id`, () => {
    context(`Given no destinations`, () => {
      it(`responds with 404`, () => {
        const destId = 123456;
        return supertest(app)
          .get(`/api/destinations/${destId}`)
          .expect(404, { error: { message: `Destination doesn't exist` } })
      });
    });

    context('Given there are destinations in the database', () => {
      const testRouteTypes = makeRouteTypesArray();
      const testLocations = makeLocationsArray();
      const testRoutes = makeRoutesArray()
      const testDestinations = makeDestinationsArray();

      beforeEach('insert destinations', () => {
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
          .then(() => {
            return db
              .into('destinations')
              .insert(testDestinations)
          })
      });

      it('responds with 200 and the specified destination', () => {
        const destId = 2
        const expectedDestination = testDestinations[destId - 1]
        return supertest(app)
          .get(`/api/destinations/${destId}`)
          .expect(200, expectedDestination)
      });
    });

    context(`Given an XSS attack content`, () => {
      const testRouteTypes = makeRouteTypesArray();
      const testLocations = makeLocationsArray();
      const testRoutes = makeRoutesArray();
      const { maliciousDestination, expectedDestination } = makeMaliciousDestination();

      beforeEach('insert malicious destination', () => {
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
          .then(() => {
            return db
              .into('destinations')
              .insert([ maliciousDestination ])
          })
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/destinations/${maliciousDestination.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.destination).to.eql(expectedDestination.destination)
            expect(res.body.content).to.eql(expectedDestination.content)
          })
      });
    });
  });

  describe(`POST /api/destinations`, () => {
    const testRouteTypes = makeRouteTypesArray();
    const testLocations = makeLocationsArray();
    const testRoutes = makeRoutesArray();

    beforeEach('insert route types, locations, and routes', () => {
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
    });

    it(`creates a destination, responding with 201 and the new destination`, () => {
      const newDestination = {
        destination: 'Test new destination',
        content: 'Test new destination content...',
        sequence_num: 1,
        route_id: 1,
        dest_address:'20 W 34th St',
        dest_lat: '40.748817',
        dest_lng: '-73.985428',
        place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
        formatted_address: '20 W 34th St'
      };
      return supertest(app)
        .post('/api/destinations')
        .send(newDestination)
        .expect(201)
        .expect(res => {
          expect(res.body.destination).to.eql(newDestination.destination)
          expect(res.body.content).to.eql(newDestination.content)
          expect(res.body.sequence_num).to.eql(newDestination.sequence_num)
          expect(res.body.route_id).to.eql(newDestination.route_id)
          expect(res.body.dest_address).to.eql(newDestination.dest_address)
          expect(res.body.dest_lat).to.eql(newDestination.dest_lat)
          expect(res.body.dest_lng).to.eql(newDestination.dest_lng)
          expect(res.body.place_id).to.eql(newDestination.place_id)
          expect(res.body.formatted_address).to.eql(newDestination.formatted_address)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/destinations/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/destinations/${res.body.id}`)
            .expect(res.body)
        )
    });

    const requiredFields = ['destination', 'content', 'sequence_num', 'route_id', 'dest_address', 'dest_lat', 'dest_lng'];

    requiredFields.forEach(field => {
        const newDestination = {
            destination: 'Test new destination',
            content: 'Test new destination content...',
            sequence_num: 1,
            route_id: 1,
            dest_address: '20 W 34th St',
            dest_lat: 40.748817,
            dest_lng: -73.985428,
            place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
            formatted_address: '20 W 34th St'
        };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newDestination[field]

        return supertest(app)
          .post('/api/destinations')
          .send(newDestination)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      });
    });

    it('removes XSS attack content from response', () => {
      const { maliciousDestination, expectedDestination } = makeMaliciousDestination();
      return supertest(app)
        .post(`/api/destinations`)
        .send(maliciousDestination)
        .expect(201)
        .expect(res => {
            expect(res.body.destination).to.eql(expectedDestination.destination)
            expect(res.body.content).to.eql(expectedDestination.content)
            expect(res.body.sequence_num).to.eql(expectedDestination.sequence_num)
            expect(res.body.route_id).to.eql(expectedDestination.route_id)
            expect(res.body.dest_address).to.eql(expectedDestination.dest_address)
            expect(res.body.dest_lat).to.eql(expectedDestination.dest_lat)
            expect(res.body.dest_lng).to.eql(expectedDestination.dest_lng)
            expect(res.body.place_id).to.eql(expectedDestination.place_id)
            expect(res.body.formatted_address).to.eql(expectedDestination.formatted_address)
        })
    });
  });

  describe(`DELETE /api/destinations/:dest_id`, () => {
    context(`Given no destinations`, () => {
      it(`responds with 404`, () => {
        const destId = 123456
        return supertest(app)
          .delete(`/api/destinations/${destId}`)
          .expect(404, { error: { message: `Destination doesn't exist` } })
      })
    });

    context('Given there are destinations in the database', () => {
      const testRouteTypes = makeRouteTypesArray();
      const testLocations = makeLocationsArray();
      const testRoutes = makeRoutesArray();
      const testDestinations = makeDestinationsArray();

      beforeEach('insert destinations', () => {
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
          .then(() => {
              return db
                .into('destinations')
                .insert(testDestinations)
          })
      });

      it('responds with 204 and removes the destination', () => {
        const idToRemove = 2
        const expectedDestination = testDestinations.filter(dest => dest.id !== idToRemove)
        return supertest(app)
          .delete(`/api/destinations/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/destinations`)
              .expect(expectedDestination)
          )
      });
    });
  });

  describe(`PATCH /api/destinations/:dest_id`, () => {
    context(`Given no destinations`, () => {
      it(`responds with 404`, () => {
        const destId = 123456
        return supertest(app)
          .delete(`/api/destinations/${destId}`)
          .expect(404, { error: { message: `Destination doesn't exist` } })
      })
    });

    context('Given there are destinations in the database', () => {
      const testRouteTypes = makeRouteTypesArray();
      const testLocations = makeLocationsArray();
      const testRoutes = makeRoutesArray();
      const testDestinations = makeDestinationsArray();

      beforeEach('insert destinations', () => {
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
          .then(() => {
              return db
                .into('destinations')
                .insert(testDestinations)
          })
      });

      it('responds with 204 and updates the destination', () => {
        const idToUpdate = 2;
        const updateDestination = {
          destination: 'updated destination title',
          content: 'updated destination summary',
          sequence_num: 1,
          route_id: 1,
          dest_address: '2151 Dustin Way',
          dest_lat: '36.9809812',
          dest_lng: '-121.9844785',
          place_id: 'ChIJv4JR1wPLj4ARxtzdGT8UiXs',
          formatted_address: '2151 Dustin Way'
        };
        const expectedDestination = {
          ...testDestinations[idToUpdate - 1],
          ...updateDestination
        };
        return supertest(app)
          .patch(`/api/destinations/${idToUpdate}`)
          .send(updateDestination)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/destinations/${idToUpdate}`)
              .expect(expectedDestination)
          )
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/destinations/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain a destination, sequence number, and route ID`
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateDestination = {
          destination: 'updated destination title',
        };
        const expectedDestination = {
          ...testDestinations[idToUpdate - 1],
          ...updateDestination
        };

        return supertest(app)
          .patch(`/api/destinations/${idToUpdate}`)
          .send({
            ...updateDestination,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/destinations/${idToUpdate}`)
              .expect(expectedDestination)
          )
      });
    });
    });
});