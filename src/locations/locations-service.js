const LocationsService = {
    getAllLocations(knex) {
        return knex.select('*').from('locations')
    },
    insertLocation(knex, newLocation) {
        return knex
            .insert(newLocation)
            .into('locations')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = LocationsService