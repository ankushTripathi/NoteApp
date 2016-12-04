var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var Message = require('./models/message');
var bodyParser = require('body-parser');
var msgController = require('./controllers/message');

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

router.route('/msg')
.post(msgController.newMessage)
.get(msgController.AllMessages);

router.route('/msg/:msg_id')
.get(msgController.displayMessage)
.put(msgController.updateMessage)
.delete(msgController.deleteMessage);


//start server on port 3000
app.listen(3000,function(){
	console.log("listening on port:3000");
});