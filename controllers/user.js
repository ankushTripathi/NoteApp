var User = require('../models/user');

module.exports.addUser = function(req,res){
	var user = new User({
		username:req.body.username,
		password:req.body.password
	});

	user.save(function(err,info){
		if(err)
			res.json({head:"post users",error:"could not add user",message:""});
		else
			res.json({head:"post users",error:"None",message:"user stored :",info:info});
	});
}

module.exports.AllUsers = function(req,res){
	User.find(function(err,users){
		if(err)
			res.json({head:"get users",error:"could not get user",message:""});
		else
			res.json({head:"get users",error:"None",message:"users retrieved :",info:users});
	});	
}