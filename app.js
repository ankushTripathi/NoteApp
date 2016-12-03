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


var textRoute = router.route('/text');

textRoute.post(function(req,res,next){

	var message = new Message();
	
	message.to = req.body.to;
	message.from = req.body.from;
	message.dateTime = req.body.date;
	message.subject = req.body.subject;
	message.content = req.body.content;

	message.save(function(err,info){
		if(err)
			res.json({head:"post text",error:"could not save message",message:""});
		else
			res.json({head:"post text",error:"None",message:"message stored :"+info});
	});

});

//start server on port 3000
app.listen(3000,function(){
	console.log("listening on port:3000");
});