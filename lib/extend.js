function extend(model, object) {
	var
	property;
	for (property in object) {
		model[property] = object[property];
	}
	return model;
}

module.exports = extend;

