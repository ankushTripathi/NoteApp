var mongoose = require('mongoose');

var codeSchema = new mongoose.Schema({

	value:{type:String,required:true},

	redirecturi:{type:String,required:true},

	userId:{type:String,required:true},

	clientId:{type:String,required:true}
});


codeSchema.pre('save',function(callback){

	var code = this;
	if(!code.isModified('value'))
		return callback();
	bcrypt.genSalt(10,function(err,salt){
		if(err)
			return callback(err);
		bcrypt.hash(code.value,salt,null,function(err,hash){
			if(err)
				return callback(err);
			code.value = hash;
			callback();
		});	
	});
});

module.exports = mongoose.model('Code',codeSchema); 