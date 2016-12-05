var Message = require('../models/message');
var User = require('../models/user');

function validate(req,res,callback){
	User.findById(req.user._id,'username',function(err,from){
		if(err)
			throw err;

		var object = {};
		object.from = from.username;
		object.userId = req.user._id;

		User.findOne({username:req.body.to},'username',function(err,to){
			if(err)
				callback(err,null);
			if(to)
				object.to = to.username;
			else
				callback("could not find recipent",null);
			
			var d = new Date();
			object.datetime = d.toString();

			object.subject = req.body.subject;
			object.content = req.body.content;
			
			callback(null,object);
		});
	});
}

module.exports.newMessage = function(req,res) {
	try{

		validate(req,res,function(err,msg){
			if(err)
				throw err;
			var message = new Message({
				to : msg.to,
				from : msg.from,
				datetime : msg.datetime,
				subject : msg.subject,
				content : msg.content,
				userId : msg.userId
			});
			message.save(function(err,info){
				if(err)
					throw err
				else
					res.json({head:"post messages",error:"None",message:"message stored :",info:info});
			});
		});
	}catch(err){
		res.json({head:"post messages",error:"could not save message",message:err});
	}
		

} 

module.exports.AllMessages = function(req,res){
	Message.find({userId:req.user._id},function(err,msgs){
		if(err)
			res.json({head:"get messages",error:"could not retrieve message",message:err.errmsg});
		else
			res.json({head:"get messages",error:"None",message:"messages retrieved",info:msgs});
	});
}

module.exports.displayMessage = function(req,res){

		Message.find({userId:req.user._id,_id:req.params.msg_id},'to from subject content',function(err,msg){
		if(err)
			res.json({head:"get message",error:"could not find the message",message:err.errmsg});
		else
		{
			res.json({head:"get message",error:"None",message:"message found",info:msg});
		}
	});
}

module.exports.updateMessage = function(req,res){
	var update = req.body;

	Message.update({userId:req.user._id,_id:req.params.msg_id},update,{new:true},function(err,msg){
		if(err)
			res.json({head:"put message",error:"could not update message",message:err.errmsg});
		else
			res.json({head:"put message",error:"None",message:"message updated",info:msg});
	});
}

module.exports.deleteMessage = function(req,res){
		Message.remove({userId:req.user._id,_id:req.params.msg_id},function(err,msg){
		if(err)
			res.json({head:"delete message",error:"could not delete message",message:err.errmsg});
		else
			res.json({head:"delete message",error:"None",message:"message deleted",info:msg});
	});

}