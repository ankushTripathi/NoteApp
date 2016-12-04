var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var Message = require('./models/message');
var bodyParser = require('body-parser');

var app = express();

var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/NoteApp');

var router = express.Router();

app.use(bodyParser.json());
//use /api as main route.. for now
app.use('/api',router);

router.get('/',function(req,res,next) {

	res.json({head:"index" , error:"None" , message:"No No"});

});


var messages = router.route('/msg');

messages.post(function(req,res,next){

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
			res.json({head:"post messages",error:"None",message:"message stored :\n"+info});
	});

});

messages.get(function(req,res,next){

	Message.find(function(err,msgs){
		if(err)
			res.json({head:"get messages",error:"could not retrieve message",message:""});
		else
			res.json({head:"get messages",error:"None",message:"messages retrieved",info:msgs});
	});

});

var msgRoute = router.route('/msg/:msg_id');

msgRoute.get(function(req,res,next){

	Message.findById(req.params.msg_id,'to from subject content',function(err,msg){

		if(err)
			res.json({head:"get message",error:"could not find the message",message:""});
		else
		{
			res.json({head:"get message",error:"None",message:"message found",info:msg});
		}
	});

});

msgRoute.put(function(req,res,next){
	var update = req.body;

	Message.findOneAndUpdate({_id:req.params.msg_id},update,{new:true},function(err,msg){
		if(err)
			res.json({head:"put message",error:"could not update message",message:""});
		else
			res.json({head:"put message",error:"None",message:"message updated",info:msg});
	});
});

msgRoute.delete(function(req,res,next){

	Message.findOneAndRemove({_id:req.params.msg_id},function(err,msg){
		if(err)
			res.json({head:"delete message",error:"could not delete message",message:""});
		else
			res.json({head:"delete message",error:"None",message:"message deleted",info:msg});
	});

});

//start server on port 3000
app.listen(3000,function(){
	console.log("listening on port:3000");
});