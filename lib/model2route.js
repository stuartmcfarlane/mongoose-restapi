function model2route(baseRoute, Model, id) {
	var
	route = baseRoute + '/' + Model.modelName.toLowerCase() + 's';
	if ('undefined' !== typeof id) {
		route += '/' + id;
	}
	return route;
}

module.exports = model2route;
