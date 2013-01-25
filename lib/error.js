function error(res, err, status) {
	if ('undefined' === status) {
		status = 500;
	}
	console.log(err);
	if (err.name === 'ValidationError') status = 403; // Forbidden
	res.send(status);
}

module.exports = error;