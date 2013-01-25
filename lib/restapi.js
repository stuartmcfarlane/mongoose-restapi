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
extend = require('./extend.js'),
error = require('./error.js');

var
defaultConfig = {
	baseRoute: '/api',
	debug: false
};

function restapify(app, modelName, Model, config){

	var
	route = config.baseRoute + '/' + modelName.toLowerCase() + 's';
	//
	// GET route
	//
	if (config.debug) console.log('register ' + route + ' GET');
	app.get(route, function(req,res){
		if (config.debug) console.log('GET ' + route);
		return Model.find(function(err,model){
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
		return Model.findById(req.params.id, function(err,model){
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
		model = extend(new Model(), req.body);
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
		return Model.findById(req.params.id, function(err,model){
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
		return Model.findById(req.params.id, function(err, model){
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
	use: use,
	restapify: restapify
};