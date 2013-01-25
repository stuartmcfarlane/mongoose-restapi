/* restapi/index.js
 *
 * Add REST routes to an express app for a mongoose schema
 */

var
Server = require('./lib/server.js'),
Client = require('./lib/client.js');

module.exports = {
	Server: Server,
	Client: Client
};