/*
 * mongoose-restapi/test/server.js
 *
 * Unit tests for mongoose-restapi/lib/server.js
 */

	var
	express = require("express"),
	app = express(),
	mongoose = require('mongoose'),
	restapi = require('..'),
	TestSchema = mongoose.Schema({
		name: {type: String, required: true},
		description: {type: String, required: true}
	}),
	TestModel = mongoose.model('Test', TestSchema),
	restapiServer = new restapi.Server({
		baseRoute: '/api',
		app: app,
		models: [
			TestModel
		]
	}),
	localClient = new restapi.Client({
	}),
	httpClient = new restapi.Client({
		url: 'http://localhost:4243',
		requestMock: {
			get: function(url, fn) {
				return fn(null, null, [
					{name:"t4n",description:"t4d",_id:4},
					{name:"t5n",description:"t5d",_id:5}
				]);
			}
		}
	});

	app.configure(function () {
		app.use(express.bodyParser());
		app.use(app.router);
	});


exports['restapi server tests'] = {
	setUp: function(fn){
		// Create/use Test database
		mongoose.connect('mongodb://localhost/restapi-test');

		fn();
	},
	tearDown: function(fn){
		mongoose.disconnect(function(err){
			if(err)console.log(err);
			fn();
		});
	},
	'can create Server express and mongoose': function(test){
		test.done();
	},
	'GET /api/tests returns array': function(test){
		app.router({
			method: 'get',
			url: '/api/tests'
		},{
			send: function(json){
				test.equal(typeof json, 'object');
				test.done();
			}
		},
		function(err){
			test.ok(false, 'failed to route');
			test.done();
		});
	},
	'POST /api/tests adds an item': function(test){
		app.router({
			method: 'post',
			url: '/api/tests',
			body: {name:"t1n",description:"t1d"}
		},{
			send: function(json){
				test.equal(json.name, 't1n');
				test.equal(json.description, 't1d');
				test.done();
			}
		},
		function(err){
			test.ok(false, 'failed to route /api.tests');
			test.done();
		});
	},
	'GET /api/tests/:id gets an item': function(test){
		app.router({
			method: 'get',
			url: '/api/tests'
		},{
			send: function(json){
				test.ok(json.length !== 0);
				var t = json[json.length - 1];
				// now put a new name in the last elemenet of the index
				app.router({
					method: 'get',
					url: '/api/tests/' + t._id
				},{
					send: function(json) {
						test.equal(json.name, t.name);
						test.done();
					}
				}, function() {
					test.ok(false, 'failed to route PUT /api/tests/' + t._id);
					test.done();
				});
			}
		}, function(){
			test.ok(false, 'failed to route /api/tests');
			test.done();
		});
	},
	'PUT /api/tests modifies an item': function(test){
		// first lets get the index
		app.router({
			method: 'get',
			url: '/api/tests'
		},{
			send: function(json){
				test.ok(json.length !== 0);
				var t = json[json.length - 1];
				// now put a new name in the last elemenet of the index
				t.name = 'test put';
				app.router({
					method: 'put',
					url: '/api/tests/' + t._id,
					body: {name: t.name, description: t.description}
				},{
					send: function(json) {
						test.equal(json.name, 'test put');
						test.done();
					}
				}, function() {
					test.ok(false, 'failed to route PUT /api/tests/' + t._id);
					test.done();
				});
			}
		}, function(){
			test.ok(false, 'failed to route /api/tests');
			test.done();
		});
	}
};

exports['restapi client tests'] = {
	setUp: function(fn){
		// Create/use Test database
		mongoose.connect('mongodb://localhost/restapi-test');

		fn();
	},
	tearDown: function(fn){
		mongoose.disconnect(function(err){
			if(err)console.log(err);
			fn();
		});
	},
	'can create Client express and mongoose': function(test){
		test.done();
	},
	'get local Model with client returns array': function(test) {
		localClient.get(TestModel, function(err, testModel) {
			test.ok(err === null);
			test.ok(Array.isArray(testModel));
			test.done();
		});
	},
	'get Model with client returns array': function(test) {
		httpClient.get(TestModel, function(err, testModel) {
			test.ok(err === null);
			test.ok(Array.isArray(testModel));
			test.done();
		});
	},
	// 'get(id) Model with client returns Model object': function(test) {
	// 	test.failed();
	// },
	// 'post Model with client creates an object in db': function(test) {
	// 	test.failed();
	// },
	// 'put Model with client sets an object in db': function(test) {
	// 	test.failed();
	// },
	// 'delete Model with client removes an object from db': function(test) {
	// 	test.failed();
	// }
};
