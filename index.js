/* restapi/index.js
 *
 * Add REST routes to an express app for a mongoose schema
 */

var
restapi = require('./lib/restapi.js');

module.exports = {
	use: restapi.use
};