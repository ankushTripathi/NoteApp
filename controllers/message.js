var Message = require('../models/message');

module.exports.newMessage = function(req,res) {
	var message = new Message();
	
	message.to = req.body.to;
	message.from = req.body.from;
	message.datetime = req.body.datetime;
	message.subject = req.body.subject;
	message.content = req.body.content;

	message.save(function(err,info){
		if(err)
			res.json({head:"post messages",error:"could not save message",message:""});
		else
			res.json({head:"post messages",error:"None",message:"message stored :",info:info});
	});
} 

module.exports.AllMessages = function(req,res){
	Message.find(function(err,msgs){
		if(err)
			res.json({head:"get messages",error:"could not retrieve message",message:""});
		else
			res.json({head:"get messages",error:"None",message:"messages retrieved",info:msgs});
	});
}

module.exports.displayMessage = function(req,res){

		Message.findById(req.params.msg_id,'to from subject content',function(err,msg){
		if(err)
			res.json({head:"get message",error:"could not find the message",message:""});
		else
		{
			res.json({head:"get message",error:"None",message:"message found",info:msg});
		}
	});
}

module.exports.updateMessage = function(req,res){
	var update = req.body;

	Message.findOneAndUpdate({_id:req.params.msg_id},update,{new:true},function(err,msg){
		if(err)
			res.json({head:"put message",error:"could not update message",message:""});
		else
			res.json({head:"put message",error:"None",message:"message updated",info:msg});
	});
}

module.exports.deleteMessage = function(req,res){
		Message.findOneAndRemove({_id:req.params.msg_id},function(err,msg){
		if(err)
			res.json({head:"delete message",error:"could not delete message",message:""});
		else
			res.json({head:"delete message",error:"None",message:"message deleted",info:msg});
	});

}