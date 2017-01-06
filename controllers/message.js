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
			if(to){
				if(to == req.user.username)
					callback("cannot send to self",null);
				else
					object.to = to.username;
			}
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

module.exports.sendMessage = function(req,res) {

		validate(req,res,function(err,msg){
			if(err)
				res.json({head:"post messages",error:"could not save message",message:err});
			var message = new Message({
				to : msg.to,
				from : msg.from,
				datetime : msg.datetime,
				subject : msg.subject,
				content : msg.content,
				userId : msg.userId,
			});
			message.save(function(err,msg){
				if(err)
					res.json({head:"post messages",error:"could not save message",message:err});
				else{
					msgId = {"msgId":message._id};
					User.findOneAndUpdate({username:message.from},{$push:{sentMessages:msgId}},function(err,info){
						if(err)
							res.json({head:"post messages",error:"could not save message",message:err});
						User.findOneAndUpdate({username:message.to},{$push:{recievedMessages:msgId}},function(err,info){
							if(err)
								res.json({head:"post messages",error:"could not save message",message:err});
							res.json({head:"post messages",error:"None",messages:"Message Sent",info:msg});
						});
					});
				}
			});
		});
} 

module.exports.AllMessages = function(req,res){
	Message.find({ $or:[ {'userId':req.user._id}, {'to':req.user.username}]},function(err,msgs){
		if(err)
			res.json({head:"get messages",error:"could not retrieve message",message:err.errmsg});
		else
			{
				var obj = {},sentMessages = [],recievedMessages = [];
				for(var i = 0; i<msgs.length;i++){
					if(msgs[i].userId == req.user._id)
						sentMessages.push(msgs[i]);
					else
						recievedMessages.push(msgs[i]);
				}
				obj.sent = sentMessages;
				obj.recieved = recievedMessages;
				res.json({head:"get messages",error:"None",message:"messages retrieved",info:obj});
			}
	});
}

module.exports.displayMessage = function(req,res){

		Message.find({$or:[{'userId':req.user._id,'_id':req.params.msg_id},{'_id':req.params.msg_id,'to':req.user.username}]}
			,'to from subject content'
			,function(err,msg){
		if(err)
			res.json({head:"get message",error:"could not find the message",message:err.errmsg});
		else
		{
			res.json({head:"get message",error:"None",message:"message found",info:msg});
		}
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