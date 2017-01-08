var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var clientSchema = new mongoose.Schema({

	name   : {
				type     : String,
				unique   : true,
				required : true
			 },
	id     : {
				type     : String,
				unique   : true,
				required : true
			 },
	secret : {
				type     : String,
				unique   : true,
				required : true
			 },
	password : {
				type     : String,
				required : true
			 }

});

clientSchema.pre('save',function(callback){
	var client = this;
	if(!client.isModified('password'))
		return callback();	
	bcrypt.genSalt(10,function(err,salt){
		if(err)
			return	callback(err);
		bcrypt.hash(client.password,salt,null,function(err,hash){
			if(err)
				return callback(err);
			client.password = hash;
			return callback();		
			});
	});
});

clientSchema.methods.verify = function(password,callback){
	bcrypt.compare(password,this.password,function(err,isMatch){
		if(err)
			return callback(err);
		else
			return callback(null,isMatch);
	});
}

module.exports = mongoose.model('Client',clientSchema);