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

tokenSchema.pre('save',function(callback){
	bcrypt.genSalt(10,function(err,salt){
		if(err)
			return callback(err);
		bcrypt.hash(this.value,salt,null,function(err,hash){
			if(err)
				return callback(err);
			this.value = hash;
			callback();
		});
	});
});

module.exports = mongoose.model('Token',tokenSchema);