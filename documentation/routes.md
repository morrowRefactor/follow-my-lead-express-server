# Routes

Routes are tied to a location and contain mutliple destinations for users to follow.

## GET All Routes

**URL**: `/api/routes`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
  "id": 1,
  "route_name": "Dublin Literary trail",
  "route_summ": "Here is a manageable literary historical day long walking tour.",
  "route_type_id": 2,
  "location_id": 1
}
```

## Add New Route

**URL**: `/api/routes`  
**Method**: `POST`

**Data Example**  
Provide a route name, route summary, route type ID, and location ID.

```json
{
  "route_name": "San Francisco's Golden Gate Park",
  "route_summ": "The greener side of San Francisco.  Golden Gate Park is amazing.  And big!  Here are some recommended places in one of the most beautiful parts of the city.",
  "route_type_id": 1,
  "location_id": 3
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
  "id": 3,
  "route_name": "San Francisco's Golden Gate Park",
  "route_summ": "The greener side of San Francisco.  Golden Gate Park is amazing.  And big!  Here are some recommended places in one of the most beautiful parts of the city.",
  "route_type_id": 1,
  "location_id": 3
}
```

## Edit Existing Route

**URL**: `/api/routes/route_id`  
**Method**: `PATCH`

**Data Example**  
Provide a route ID, route name, route summary, route type ID, and location ID.

```json
{
  "id": 3,
  "route_name": "San Francisco's Golden Gate Park",
  "route_summ": "Here's my updated content.  This place is wonderful!",
  "route_type_id": 1,
  "location_id": 3
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
  "id": 3,
  "route_name": "San Francisco's Golden Gate Park",
  "route_summ": "Here's my updated content.  This place is wonderful!",
  "route_type_id": 1,
  "location_id": 3
}
```

## Delete Existing Route

**URL**: `/api/routes/route_id`  
**URL Parameters**: `route_id=[integer]` where `route_id` is the ID of the route in the database.  
**Method**: `DELETE`  
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

