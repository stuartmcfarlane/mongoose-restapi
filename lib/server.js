/*
 * mongoose-restapi/lib/server.js
 *
 * Server class
 *
 */

var
defaultConfig = require('./defaultConfig.js'),
extend = require('./extend.js'),
restapify = require('./restapify.js');

function Server(config) {
	var
	_config = extend(defaultConfig, config || {});

	var
	register = function(models) {
		if (!Array.isArray(models)) {
			models = [models];
		}
		models.forEach(function(model) {
			if (_config.debug) console.log('registering model', model.modelName);
			restapify(model, _config);
		});
	};

	if (_config.debug) console.log('constructing Server');
	if (_config.models !== 'undefined') {
		register(_config.models);
	}

	return {
		register : register
	};
}

module.exports = Server;