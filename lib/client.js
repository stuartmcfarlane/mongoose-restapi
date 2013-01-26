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
model2route = require('./model2route.js');

function clientError(err) {
	return err.code;
}
function Client(config) {
	var
	_config = extend(defaultConfig, config || {});

	request = _config.requestMock || request;

	var
	httpGet = function(Model, fn) {
		var
		url = _config.url + model2route(_config.baseRoute, Model);
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
			fn(null, models);
		});
	},
	localGet = function(Model, fn) {
		Model.find(function(err,models){
			if(err) return clientError(err);
			if(null === models) return fn(null, []);
			fn(null, models);
		});
	},
	get = function(Model, fn) {
		if ('undefined' === typeof _config.url) {
			return localGet(Model, fn);
		}
		else {
			return httpGet(Model, fn);
		}
	};

	return {
		get: get
	};
}

module.exports = Client;