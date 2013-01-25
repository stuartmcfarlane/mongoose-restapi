mongoose-restapi
================

Not yet ready for public consumption...

Turn mongoose models into a REST API
------------------------------------

Adds REST routes to an express app for mongoose models.

Roadmap
=======

- Sane interface
- Server/Client mode
- Authentication

Sane interface
==============

Sometning like

	var
	express = require("express"),
	app = express(),
	mongoose = require('mongoose'),
	restapi = require('mongoose-restapi'),
	TestSchema = mongoose.Schema({
		name: {type: String, required: true},
		description: {type: String, required: true}
	}),
	TestModel = mongoose.model('Test', TestSchema),
	restapiServer = new restapi.Server({
		base: '/api',
		app: app,
		models: [
			TestModel
		]
	});

	app.configure(function () {
		app.use(express.bodyParser());
		app.use(app.router);
	});

	app.listen(4242);
	console.log('Serving TestModel on http://localhost:4242');

Server/Client mode
==================

Something like

	var
	mongoose = require('mongoose'),
	restapi = require('mongoose-restapi'),
	TestSchema = mongoose.Schema({
		name: {type: String, required: true},
		description: {type: String, required: true}
	}),
	TestModel = mongoose.model('Test', TestSchema),
	restapiClient = new restapi.Client({
		models: [
			TestModel
		]
	});

	restapiClient.get(TestModel, function(err, testModel) {
		console.log('got', testModel):
	});