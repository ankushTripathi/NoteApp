var User = require('../models/user');
var Message = require('../models/message');
module.exports.addUser = function(req,res){
	var user = new User({
		username:req.body.username,
		password:req.body.password
	});

	user.save(function(err,info){
		if(err)
			res.json({head:"post users",error:"could not add user",message:err.errmsg});
		else
			res.json({head:"post users",error:"None",message:"user stored :",info:info});
	});
}

module.exports.AllUsers = function(req,res){
	User.find({},'username -_id',function(err,users){
		if(err)
			res.json({head:"get users",error:"could not get users",message:err.errmsg});
		else
			res.json({head:"get users",error:"None",message:"users retrieved :",info:users});
	});	
}

module.exports.displayUser = function(req,res){
	User.findById(req.user._id,function(err,user){
		if(err)
			res.json({head:"get user",error:"could not get user",message:err.errmsg});
		else
			res.json({head:"get user",error:"None",message:"users retrieved :",info:user});
	});
}

module.exports.editUser = function(req,res){
	User.update({_id:req.user._id},req.body,{new:true},function(err,user){
		if(err)
			res.json({head:"put user",error:"could not edit user",message:err.errmsg});
		else
			res.json({head:"put user",error:"None",message:"user edited :",info:user});
	});
}

module.exports.getUser = function(req,res){
	var sentMsgs = req.user.sentMessages;
	var msgsSent = [];
	var recieveMsgs = req.user.recievedMessages;
	var msgsRecieved = [];
	for(var i=0;i<(sentMsgs.length+recieveMsgs.length);i++){
		
		if(i<sentMsgs.length){
			Message.find({'_id':sentMsgs[i].msgId,'to':req.params.username},function(err,msg){
					if(err)
						res.json({head:"get user",error:"could not get messages",message:err.errmsg});
					else{
							if(msg){
								msgsSent.push(msg);
								console.log("sent message");
								console.log(msg);
							}
					}
				});
		}
		if(i<recieveMsgs.length){
			Message.find({'_id':recieveMsgs[i].msgId,'from':req.params.username},function(err,msg){
				if(err)
					res.json({head:"get user",error:"could not get messages",message:err.errmsg});
				else{
					if(msg){
						msgsRecieved.push(msg);
						console.log("recieved message");
						console.log(msg);
					}
				}
			});
		}
		if(i===(sentMsgs.length+recieveMsgs.length-1)){
			var msg = {
				"Sent" : msgsSent,
				"recieved" : msgsRecieved
			};
			res.json({head:"get user",error:"None",message:"users retrieved :",info:msg});
		}

	}



}