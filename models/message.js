var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({

	to:String,
	from:String,
	datetime:String,
	subject:String,
	content:String,
	userId:String,

});

module.exports = mongoose.model('Message',messageSchema);