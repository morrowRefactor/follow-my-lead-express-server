# Follow My Lead API

This backend API supports CRUD operations for the React app Follow My Lead - an app for creating and sharing routes for others to follow, building unique experiences along the way.

The live app can be viewed here: https://follow-my-lead.vercel.app/

The front-end client can be viewed here: https://github.com/morrowRefactor/follow-my-lead

## Quick App Preview
![screenshotDescription](https://user-images.githubusercontent.com/58446465/88344149-d4f47380-ccf7-11ea-8d4c-cae74147799e.png)

Browsing Routes: Users can find routes by filtering catgories (tourist, historic, or personal).

![screenshotDescription](https://user-images.githubusercontent.com/58446465/88344156-d9b92780-ccf7-11ea-98f9-801a649dc918.png)

Follow Routes: Users can select a route and follow each destination in sequence which includes descriptive content provided by the route's creator.

![screenshotDescription](https://user-images.githubusercontent.com/58446465/88344168-de7ddb80-ccf7-11ea-842e-f9a3d49aa148.png)

Creating Routes: User can add their own routes by creating a unique route and adding destinations.

![screenshotDescription](https://user-images.githubusercontent.com/58446465/88344176-e178cc00-ccf7-11ea-92a7-2865ca850151.png)

![screenshotDescription](https://user-images.githubusercontent.com/58446465/88344179-e3db2600-ccf7-11ea-978d-88432ae8f254.png)

## Technology

* Node and Express
  * RESTful Api
* Testing
  * Supertest (integration)
  * Mocha and Chai (unit)
* Database
  * Postgres
  * Knex.js - SQL wrapper

#### Production

Deployed via Heroku

## Open Endpoints
All endpoints are open, no authentication required.

[Route Types](documentation/route-types.md): `GET /api/route-types`  
[Locations](documentation/locations.md): `GET /api/locations`  
[Show Routes](documentation/routes.md): `GET /api/routes`  
[Show Destinations](documentation/destinations.md): `GET /api/destinations`

### Add Content

[Add Location](documentation/locations.md): `POST /api/locations`  
[Add Route](documentation/routes.md): `POST /api/routes`  
[Add Destination](documentation/destinations.md): `POST /api/destination`

### Edit Content

[Edit Route](documentation/routes.md): `PATCH /api/routes/route_id`  
[Edit Destination](documentation/destinations.md): `PATCH /api/destinations/dest_id`

### Remove Content

[Remove Route](documentation/routes.md): `DELETE /api/routes/route_id`  
[Remove Destination](documentation/destinations.md): `DELETE /api/destinations/dest_id`

## Scripts 

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`