var mongoose = require('mongoose');

var propertySchema = new mongoose.Schema({
	// TODO: owner
	propertyName: String,
	image: String,
	description: String,
});

module.exports = mongoose.model('Property', propertySchema);