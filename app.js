var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

var Message = require('./models/message');
var msgController = require('./controllers/message');
var userController = require('./controllers/user');
var clientController = require('./controllers/client');
var Auth = require('./controllers/auth');

var app = express();

var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/NoteApp');

var router = express.Router();

app.use(bodyParser.json());
app.use(passport.initialize());

//use /api as main route.. for now
app.use('/api',router);

router.get('/',function(req,res,next) {

	res.json({head:"index" , error:"None" , message:"No No"});

});

//users route
router.
route('/users')
.post(userController.addUser)
.get(Auth.authenticate,userController.AllUsers);

router
.use(Auth.authenticate)
.route('/users/:username')
.get(userController.getUser);

router
.use(Auth.authenticate)
.route('/profile')
.get(userController.displayUser)
.put(userController.editUser);

// router
// .use(Auth.authenticate)
// .route('/profile/:action')
// .get(userController.getMessage)


//client route
router
.use(Auth.authenticate)
.route('/clients')
.get(clientController.getClients)
.post(clientController.addClient);

//msgs route
router
.use(Auth.authenticate)
.route('/msg')
.post(msgController.sendMessage)
.get(msgController.AllMessages);

router
.use(Auth.authenticate)
.route('/msg/:msg_id')
.get(msgController.displayMessage)
.delete(msgController.deleteMessage);


//start server on port 3000
app.listen(3000,function(){
	console.log("listening on port:3000");
});