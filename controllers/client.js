var Client = require('../models/client');
var bcrypt = require('bcrypt-nodejs');

module.exports.addClient = function(req,res) {
	
	var client = new Client();
	client.name = req.body.name;
	client.userId = req.user._id;
	var data = client.name+client.userId;
	bcrypt.hash(data,10,function(err,hash){
		if(err)
			res.json({head:"post clients",error:"could not add client",message:err.errmsg});
		else
			client.id = hash;
	});
	var key = client.id+data;
	bcrypt.hash(key,10,function(err,hash){
		if(err)
			res.json({head:"post clients",error:"could not add client",message:err.errmsg});
		else{	
			client.secret = hash;
		}
	});	
	console.log(client);
	client.save(function(err,info){
		if(err)
			res.json({head:"post clients",error:"could not add clients",message:err.errmsg});
		else
			res.json({head:"post clients",error:"None",message:"client added:",info:info});
	});

}

module.exports.getClients = function(req,res){

	Client.find({userId:req.user._id},function(err,clients){
		if(err)
			res.json({head:"get clients",error:"could not get clients",message:err.errmsg});
		else
			res.json({head:"get clients",error:"None",message:"clients list:",info:clients});
	});
}