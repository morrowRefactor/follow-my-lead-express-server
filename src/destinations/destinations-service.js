const DestinationsService = {
    getAllDestinations(knex) {
        return knex.select('*').from('destinations')
    },
    insertDestinations(knex, newDestination) {
        return knex
            .insert(newDestination)
            .into('destinations')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
       return knex.from('destinations').select('*').where('id', id).first()
    },
    deleteDestination(knex, id) {
        return knex('destinations')
            .where({ id })
            .delete()
    },
    updateDestination(knex, id, newDestinationFields) {
        return knex('destinations')
            .where({ id })
            .update(newDestinationFields)
    },
};

module.exports = DestinationsService;