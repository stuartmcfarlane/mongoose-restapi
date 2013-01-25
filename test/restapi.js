/*
 * restapi/test/restapi.js
 *
 */

var
express = null,
mongoose = null,
app = null,
restapi = null,
TestSchema = null,
TestModel = null;

express = require("express");
mongoose = require('mongoose');
app = express();
restapi = require('..');

// Create test schema and model
TestSchema = mongoose.Schema({
	name: {type: String, required: true},
	description: {type: String, required: true}
});
TestModel = mongoose.model('Test', TestSchema);

// Configure express
app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

restapi.use(app, [{
	modelName:'test',
	Schema: TestSchema,
	Model: TestModel
}], {
	baseRoute: '/api'
});


exports['restapi tests'] = {
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
	'can "use" express and mongoose': function(test){
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
}
