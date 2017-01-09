var mongoose = require('mongoose');

var codeSchema = new mongoose.Schema({

	value:{type:String,required:true},

	redirecturi:{type:String,required:true},

	userId:{type:String,required:true},

	clientId:{type:String,required:true}
});


module.exports = mongoose.model('Code',codeSchema); 