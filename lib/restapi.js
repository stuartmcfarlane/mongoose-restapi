/*
 * restapi.js
 *
 * GET        -> index
 * GET:id     -> detail
 * POST:id    -> create
 * PUT:id     -> update
 * DELETE:id  -> remove
 *
 */

var
defaultConfig = {
	baseRoute: '/api',
	debug: false
};

function error(res, err, status) {
	if ('undefined' === status) {
		status = 500;
	}
	console.log(err);
	if (err.name === 'ValidationError') status = 403; // Forbidden
	res.send(status);
}

function extend(model, object) {
	var
	property;
	for (property in object) {
		model[property] = object[property];
	}
	return model;
}

function restapify(app, modelName, Schema, config){

	var
	route = config.baseRoute + '/' + modelName + 's';
	//
	// GET route
	//
	if (config.debug) console.log('register ' + route + ' GET');
	app.get(route, function(req,res){
		if (config.debug) console.log('GET ' + route);
		return Schema.find(function(err,model){
			if(err) return error(res, err);
			return res.send(model);
		});
	});
	//
	// GET:id route
	//
	if (config.debug) console.log('register ' + route + '/:id GET');
	app.get(route + '/:id', function(req,res){
		if (config.debug) console.log('GET ' + route + '/' + req.params.id);
		return Schema.findById(req.params.id, function(err,model){
			if(err) return error(res, err);
			if(null===model) return res.send(404,'');
			return res.send(model);
		});
	});
	//
	// POST/:id route
	//
	if (config.debug) console.log('register ' + route + ' POST');
	app.post(route, function(req,res){
		var model;
		if (config.debug) console.log('POST ' + route, req.body);
		model = extend(new Schema(), req.body);
		model.save(function(err){
			if(err) return error(res, err);
			return res.send(model);
		});
	});
	//
	// PUT:id route
	//
	if (config.debug) console.log('register ' + route + '/:id PUT');
	app.put(route + '/:id', function(req,res){
		if (config.debug) console.log('PUT ' + route + '/' + req.params.id, req.body);
		return Schema.findById(req.params.id, function(err,model){
			if(err) return error(res, err);
			if(null===model) return res.send(404,'');
			model = extend(model, req.body);
			return model.save(function(err){
				if(err) return error(res, err);
				return res.send(model);
			});
		});
	});
	//
	// DELETE:id route
	//
	if (config.debug) console.log('register ' + route + '/:id DELETE');
	app.delete(route + '/:id', function(req,res){
		if (config.debug) console.log('DELETE ' + route + '/' + req.params.id);
		return Schema.findById(req.params.id, function(err, model){
			if (err) return error(res, err);
			if(null===model) return res.send(404,'');
			return model.remove(function(err){
				if(err) return error(res, err);
				return res.send('');
			});
		});
	});
}

/**
 * @function use
 *
 * Create routes for model in app
 *
 * @param app Express app object
 * @param schemas Array of mongoose { modelName, Schema }
 * @param config Extra parameters
 */
function use(app, schemas, config){

	var
	modelName = null,
	Schema = null;

	config = extend(defaultConfig, config || {});

	schemas.forEach(function(schema){
		restapify(app, schema.modelName, schema.Model, config);
	});
}

module.exports = {
	use: use
};