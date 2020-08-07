const RouteTypesService = {
    getAllRouteTypes(knex) {
        return knex.select('*').from('route_type')
    }
};

module.exports = RouteTypesService;