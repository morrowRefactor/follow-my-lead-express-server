# Locations

Unique locations, each associated with a route.

## GET All Locations

**URL**: `/api/locations`

**Method**: `GET`

#### Success Response
**Code**: `200 OK`
**Response Example**:
```json
{
  "id": 1,
  "city": "Santa Cruz",
  "state_province": "California",
  "country": "United States",
  "unique_loc": "Santa-Cruz-California-United-States"
}
```

## Add New Location

**URL**: `/api/locations`

**Method**: `POST`

**Data Example**
Provide a city, state/province, country, and unique location string.

```json
{
  "city": "Dublin",
  "state_province": "Leinster",
  "country": "Ireland",
  "unique_loc": "Dublin-Leinster-Ireland"
}
```

**Response Example**:
**Code**: `201 CREATED`

```json
{
  "city": "Dublin",
  "state_province": "Leinster",
  "country": "Ireland",
  "unique_loc": "Dublin-Leinster-Ireland"
}
```