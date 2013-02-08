/*
 * mongoose-restapi/lib/client.js
 *
 * Client class
 *
 */

var
defaultConfig = require('./defaultConfig.js'),
extend = require('./extend.js'),
request = require('request'),
model2route = require('./model2route.js'),
req2query = require('./req2query.js');

function clientError(err) {
	return err.code;
}
function Client(config) {
	var
	_config = extend(config || {}, defaultConfig);

	request = _config.requestMock || request;

	var
	argumentsSignature = function(args) {
		var
		sig = [],
		p;
		for (p in args) {
			sig.push(typeof args[p]);
		}
		return sig.join();
	},
	httpGet= function(url) {
		if (_config.debug) console.log('GET ' + url);
		request.get(url, function(err, res, body) {
			var
			models;
			if (err) return fn(clientError(err));
			if (!Array.isArray(body)) {
				body = [ body ];
			}
			models = body.map(function(model) {
				return extend(new Model(model));
			});
			return fn(null, models);
		});
	},
	httpGetIndex = function(Model, fn) {
		return httpGet(Model, _config.url + '/', fn);
	},
	httpGetId = function(Model, id, fn) {
		return httpGet(Model, _config.url + '/' + id, fn);
	},
	httpGetQuery = function(Model, query, fn) {
		var
		qa = [],
		q = '',
		p;
		for (p in query) {
			qa.push(p + '=' + query[p]);
		}
		if (qa) {
			q = '?' + qa.join('&');
		}
		return httpGet(Model, _config.url + q, fn);
	},
	localGetIndex = function(Model, fn) {
		Model.find(function(err,models){
			if(err) return clientError(err);
			if(null === models) return fn(null, []);
			fn(null, models);
		});
	},
	localGetId = function(Model, id, fn) {
		Model.findById(id, function(err,models){
			if(err) return clientError(err);
			if(null === models) return fn(null, []);
			fn(null, models);
		});
	},
	localGetQuery = function(Model, query, fn) {
		Model.find(req2query(query), function(err,models){
			if(err) return clientError(err);
			if(null === models) return fn(null, []);
			fn(null, models);
		});
	},
	muxArguments = function(mux, args, fn) {
		var
		key = argumentsSignature(args);
		if ('undefined' === typeof mux[key]) return fn('Can\'t mux ' + key, null);
		return mux[key].apply(this, args);
	},
	// get(Model, fn)
	// get(Model, id, fn)
	// get(Model, query, fn)
	get = function(Model, constraint, fn) {
		if ('undefined' === typeof _config.url) {
			return muxArguments({
				'function,function': localGetIndex,
				'function,string,function': localGetId,
				'function,object,function': localGetQuery
				},
				arguments);
		}
		else {
			return muxArguments([
				{ 'function,function': httpGetIndex },
				{ 'function,string,function': httpGetId },
				{ 'function,object,function': httpGetQuery }
				],
				arguments);
		}
	};

	return {
		get: get
	};
}

module.exports = Client;