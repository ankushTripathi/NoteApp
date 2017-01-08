var Client = require('../models/client');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

module.exports.addClient = function(req,res) {
	
	var client = new Client();

	client.name = req.body.name;
	client.password = req.body.password;

	var id = crypto.randomBytes(20).toString('hex');
	var data = client.name+client.password.slice(2,-1)+((+new Date()/1000).toString())+id;
	client.id = bcrypt.hashSync(data);

	var salt = bcrypt.genSaltSync();
	var secret = crypto.randomBytes(20).toString('hex');
	var key = client.id + secret;
	bcrypt.hash(key,salt,null,function(err,hash){
		if(err)
			res.json({head:"post clients",error:"could not add clients",message:err.errmsg});
		else
			client.secret = hash;
	});

	console.log("data : "+data);
	console.log("secret :"+secret);
	console.log("client :");
	console.log(client);

	client.save(function(err,info){
		if(err)
			res.json({head:"post clients",error:"could not add clients",message:err.errmsg});
		else
			res.json({head:"post clients",error:"None",message:"client added:",info:info});
	});
}

module.exports.getClient = function(req,res){
	console.log(req.user);
	Client.findById(req.user._id,function(err,client){
		if(err)
			res.json({head:"get clients",error:"could not get clients",message:err.errmsg});
		else
			res.json({head:"get clients",error:"None",message:"clients list:",info:client});
	});
}