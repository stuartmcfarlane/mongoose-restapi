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
	ServerTestSchema = mongoose.Schema({
		name: {type: String, required: true},
		description: {type: String, required: true}
	}),
	ServerTestModel = mongoose.model('ServerTest', ServerTestSchema),
	restapiServer = new restapi.Server({
		base: '/api',
		app: app,
		models: [
			ServerTestModel
		]
	});

	app.configure(function () {
		app.use(express.bodyParser());
		app.use(app.router);
	});


exports['restapi server tests'] = {
	setUp: function(fn){
		// Create/use ServerTest database
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
	'GET /api/servertests returns array': function(test){
		app.router({
			method: 'get',
			url: '/api/servertests'
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
	'POST /api/servertests adds an item': function(test){
		app.router({
			method: 'post',
			url: '/api/servertests',
			body: {name:"t1n",description:"t1d"}
		},{
			send: function(json){
				test.equal(json.name, 't1n');
				test.equal(json.description, 't1d');
				test.done();
			}
		},
		function(err){
			test.ok(false, 'failed to route /api.servertests');
			test.done();
		});
	},
	'GET /api/servertests/:id gets an item': function(test){
		app.router({
			method: 'get',
			url: '/api/servertests'
		},{
			send: function(json){
				test.ok(json.length !== 0);
				var t = json[json.length - 1];
				// now put a new name in the last elemenet of the index
				app.router({
					method: 'get',
					url: '/api/servertests/' + t._id
				},{
					send: function(json) {
						test.equal(json.name, t.name);
						test.done();
					}
				}, function() {
					test.ok(false, 'failed to route PUT /api/servertests/' + t._id);
					test.done();
				});
			}
		}, function(){
			test.ok(false, 'failed to route /api/servertests');
			test.done();
		});
	},
	'PUT /api/servertests modifies an item': function(test){
		// first lets get the index
		app.router({
			method: 'get',
			url: '/api/servertests'
		},{
			send: function(json){
				test.ok(json.length !== 0);
				var t = json[json.length - 1];
				// now put a new name in the last elemenet of the index
				t.name = 'test put';
				app.router({
					method: 'put',
					url: '/api/servertests/' + t._id,
					body: {name: t.name, description: t.description}
				},{
					send: function(json) {
						test.equal(json.name, 'test put');
						test.done();
					}
				}, function() {
					test.ok(false, 'failed to route PUT /api/servertests/' + t._id);
					test.done();
				});
			}
		}, function(){
			test.ok(false, 'failed to route /api/servertests');
			test.done();
		});
	}
}
