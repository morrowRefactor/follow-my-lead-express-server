const knex = require('knex')
const app = require('../src/app')
const { makeLocationsArray, makeMaliciousLocation } = require('./locations.fixtures')

describe.only('Locations Endpoints', function() {
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

  describe(`GET /api/locations`, () => {
    context(`Given no locations`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/locations')
          .expect(200, [])
      })
    })

    context('Given there are locations in the database', () => {
      const testLocations = makeLocationsArray();

      beforeEach('insert locations', () => {
        return db
          .into('locations')
          .insert(testLocations)
      })

      it('responds with 200 and all of the locations', () => {
        return supertest(app)
          .get('/api/locations')
          .expect(200, testLocations)
      })
    })

    context(`Given an XSS attack locations`, () => {
      const testLocations = makeLocationsArray();
      const { maliciousLocation, expectedLocation } = makeMaliciousLocation()

      beforeEach('insert malicious location', () => {
        return db
          .into('locations')
          .insert(maliciousLocation)
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/locations`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].city).to.eql(expectedLocation.city)
            expect(res.body[0].state_province).to.eql(expectedLocation.state_province)
            expect(res.body[0].country).to.eql(expectedLocation.country)
            expect(res.body[0].unique_loc).to.eql(expectedLocation.unique_loc)
          })
      })
    })
  })

  describe.only(`POST /api/locations`, () => {
    it(`creates a location, responding with 201 and the new location`, () => {
      const newLocation = {
        city: 'San Jose',
        state_province: 'California',
        country: 'United States',
        unique_loc: 'San-Jose-California-United-States'
      }
      return supertest(app)
        .post('/api/locations')
        .send(newLocation)
        .expect(201)
        .expect(res => {
          expect(res.body.city).to.eql(newLocation.city)
          expect(res.body.state_province).to.eql(newLocation.state_province)
          expect(res.body.country).to.eql(newLocation.country)
          expect(res.body.unique_loc).to.eql(newLocation.unique_loc)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/locations/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/locations/${res.body.id}`)
            .expect(res => {
              (res.body).to.eql(newLocation)
            })
        )
    })

    const requiredFields = ['city', 'state_province', 'country', 'unique_loc']

    requiredFields.forEach(field => {
        const newLocation = {
            city: 'Test new location',
            state_province: 'Test new location content...',
            country: 'Test new location country',
            unique_loc: 'Test-Location-Unique-Loc'
        }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newLocation[field]

        return supertest(app)
          .post('/api/locations')
          .send(newLocation)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

    it('removes XSS attack content from response', () => {
      const { maliciousLocation, expectedLocation } = makeMaliciousLocation()
      return supertest(app)
        .post(`/api/locations`)
        .send(maliciousLocation)
        .expect(201)
        .expect(res => {
          expect(res.body.city).to.eql(expectedLocation.city)
          expect(res.body.state_province).to.eql(expectedLocation.state_province)
          expect(res.body.country).to.eql(expectedLocation.country)
          expect(res.body.unique_loc).to.eql(expectedLocation.unique_loc)
        })
    })
  })
})