const knex = require('knex');
const app = require('../src/app');
const { makeRouteTypesArray, makeMaliciousRouteType } = require('./routeTypes.fixtures');

describe('RouteTypes Endpoints', function() {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('TRUNCATE route_type, locations, routes, destinations RESTART IDENTITY CASCADE'));

  afterEach('cleanup',() => db.raw('TRUNCATE route_type, locations, routes, destinations RESTART IDENTITY CASCADE'));

  describe(`GET /api/route-types`, () => {
    context(`Given no route types`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/route-types')
          .expect(200, [])
      });
    });

    context('Given there are folders in the database', () => {
      const testRouteTypes = makeRouteTypesArray();

      beforeEach('insert route types', () => {
        return db
          .into('route_type')
          .insert(testRouteTypes)
      });

      it('responds with 200 and all of the route types', () => {
        return supertest(app)
          .get('/api/route-types')
          .expect(200, testRouteTypes)
      });
    });

    context(`Given an XSS attack route types`, () => {
      const testRouteTypes = makeRouteTypesArray();
      const { maliciousRouteType, expectedRouteType } = makeMaliciousRouteType();

      beforeEach('insert malicious route type', () => {
        return db
          .into('route_type')
          .insert(maliciousRouteType)
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/route-types`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].route_type).to.eql(expectedRouteType.route_type)
          })
      });
    });
  });
});