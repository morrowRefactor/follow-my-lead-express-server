# Destinations

Destinations are associated to a route and contain location info unique to each destination.  Some fields (latitude, longitude, Place ID, formatted address) are generated via Google Maps API on the client side.

## GET All Destinations

**URL**: `/api/destinations`  
**Method**: `GET`

#### Success Response
**Code**: `200 OK`  
**Response Example**:  
```json
{
  "id": 1,
  "destination": "The Long Room Trinity College",
  "sequence_num": 1,
  "content": "This stunning library is best known as home to the Book of Kells. It is the oldest room in the Old Library at Trinity. It contains 200,000 of the Library's oldest books.",
  "route_id": 1,
  "dest_address": "The Long Room Trinity College",
  "dest_lat": "53.34395600000001",
  "dest_lng": "-6.2568003",
  "place_id": "ChIJzc-KPoQOZ0gRrjmgnAQlZgs",
  "formatted_address": "Dublin, Ireland"
}
```

## Add New Destination

**URL**: `/api/destinations`  
**Method**: `POST`

**Data Example**
Provide a destination name, content, sequence number, associated route ID, destination address, latitude, longitude, Google Place ID, Google formatted address.

```json
{
  "destination": "The Long Room Trinity College",
  "sequence_num": 1,
  "content": "This stunning library is best known as home to the Book of Kells. It is the oldest room in the Old Library at Trinity. It contains 200,000 of the Library's oldest books.",
  "route_id": 1,
  "dest_address": "The Long Room Trinity College",
  "dest_lat": "53.34395600000001",
  "dest_lng": "-6.2568003",
  "place_id": "ChIJzc-KPoQOZ0gRrjmgnAQlZgs",
  "formatted_address": "Dublin, Ireland"
}
```

**Response Example**:  
**Code**: `201 CREATED`

```json
{
  "id": 1,
  "destination": "The Long Room Trinity College",
  "sequence_num": 1,
  "content": "This stunning library is best known as home to the Book of Kells. It is the oldest room in the Old Library at Trinity. It contains 200,000 of the Library's oldest books.",
  "route_id": 1,
  "dest_address": "The Long Room Trinity College",
  "dest_lat": "53.34395600000001",
  "dest_lng": "-6.2568003",
  "place_id": "ChIJzc-KPoQOZ0gRrjmgnAQlZgs",
  "formatted_address": "Dublin, Ireland"
}
```

## Edit Existing Destination

**URL**: `/api/destinations/dest_id`  
**Method**: `PATCH`

**Data Example**
Provide a destination ID, name, content, sequence number, associated route ID, destination address, latitude, longitude, Google Place ID, Google formatted address.

```json
{
  "id": 1,
  "destination": "The Long Room Trinity College",
  "sequence_num": 1,
  "content": "Here's my updated content.  This place is great!",
  "route_id": 1,
  "dest_address": "The Long Room Trinity College",
  "dest_lat": "53.34395600000001",
  "dest_lng": "-6.2568003",
  "place_id": "ChIJzc-KPoQOZ0gRrjmgnAQlZgs",
  "formatted_address": "Dublin, Ireland"
}
```

**Response Example**:  
**Code**: `200 OK`

```json
{
  "id": 1,
  "destination": "The Long Room Trinity College",
  "sequence_num": 1,
  "content": "Here's my updated content.  This place is great!",
  "route_id": 1,
  "dest_address": "The Long Room Trinity College",
  "dest_lat": "53.34395600000001",
  "dest_lng": "-6.2568003",
  "place_id": "ChIJzc-KPoQOZ0gRrjmgnAQlZgs",
  "formatted_address": "Dublin, Ireland"
}
```

## Delete Existing Destination

**URL**: `/api/destinations/dest_id`  
**URL Parameters**: `dest_id=[integer]` where `dest_id` is the ID of the destination in the database.  
**Method**: `DELETE`  
**Data**: `{}`

**Response Example**:  
**Code**: `204 No Content`  
**Content** `{}`

