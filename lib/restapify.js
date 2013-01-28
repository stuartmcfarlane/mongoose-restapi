var
error = require('./error.js'),
extend = require('./extend.js'),
model2route = require('./model2route.js'),
req2query = require('./req2query.js');

function restapify(Model, config){

	var
	route = model2route(config.baseRoute, Model);
	//
	// GET route
	//
	if (config.debug) console.log('register ' + route + ' GET');
	config.app.get(route, function(req,res){
		if (config.debug) console.log('GET ' + route, req2query(req.query));
		return Model.find(req2query(req.query), function(err,model){
			if(err) return error(res, err);
			return res.send(model);
		});
	});
	//
	// GET:id route
	//
	if (config.debug) console.log('register ' + route + '/:id GET');
	config.app.get(route + '/:id', function(req,res){
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
	config.app.post(route, function(req,res){
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
	config.app.put(route + '/:id', function(req,res){
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
	config.app.delete(route + '/:id', function(req,res){
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

module.exports = restapify;