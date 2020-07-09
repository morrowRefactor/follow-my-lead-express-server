CREATE TABLE routes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    route_name TEXT NOT NULL,
    route_summ TEXT NOT NULL,
    route_type_id INTEGER
        REFERENCES route_type(id) ON DELETE CASCADE NOT NULL,
    location_id INTEGER
        REFERENCES locations(id) ON DELETE CASCADE NOT NULL
);