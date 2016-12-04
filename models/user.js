var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
	username:{
		type:String,
		unique:true,
		required:true
	},
	password:{
		type:String,
		required:true
	}
});

userSchema.pre('save',function(callback){

	var user = this;
	if(!user.isModified('password'))
		return callback();
	bcrypt.genSalt(10,function(err,salt){
		if(err)
			return callback(err);
		bcrypt.hash(user.password,salt,null,function(err,hash){
			if(err)
				return callback(err);
			user.password = hash;
			callback();
		});	
	});
});

module.exports = mongoose.model('User',userSchema);