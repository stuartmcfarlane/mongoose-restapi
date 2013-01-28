/**
 * lib/req2query.js
 *
 * convert req.query to a mongo/mongoose find  query structure
 *
 * eg:
 *
 * ...?name=ab => {name: /ab/i}
 *
 */
function req2query(req) {
	var
	p,
	query = {};
	for (p in req) {
		if (typeof req[p] === 'string') {
			query[p] = new RegExp(req[p], 'i');
		}
	}
	return query;
}

module.exports = req2query;