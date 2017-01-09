var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var tokenSchema = new mongoose.Schema({

	value : {
		type : String,
		required : true,
		unique : true
	},
	userId : {
		type : String,
		required : true,
		unique : true
	},
	clientId : {
		type : String,
		required : true
	}
});


module.exports = mongoose.model('Token',tokenSchema);