var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var ejs = require('ejs');
var path = require('path');

var Message = require('./models/message');
var msgController = require('./controllers/message');
var userController = require('./controllers/user');
var clientController = require('./controllers/client');
var Auth = require('./controllers/auth');
var oauth2controller = require('./controllers/oauth2');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/NoteApp');

var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(session({
	secret : "helloWorld",
	saveUninitialized : true,
	resave : true
}));
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
.get(Auth.isAuthenticated,userController.AllUsers);

router
.route('/users/:username')
.get(Auth.isAuthenticated,userController.getUser);

router
.route('/profile')
.get(Auth.isAuthenticated,userController.displayUser)
.put(Auth.isAuthenticated,userController.editUser);

// router
// .use(Auth.authenticate)
// .route('/profile/:action')
// .get(userController.getMessage)


//client route
router
.route('/clients')
.post(Auth.isAuthenticated,clientController.addClient)
.get(Auth.isAuthenticated,clientController.getClients);


//OAUTH2 route
router
.route('/oauth2/authorize')
.get(Auth.isAuthenticated,oauth2controller.authorization)
.post(Auth.isAuthenticated,oauth2controller.decision);
router
.route('/oauth2/token')
.post(Auth.isClientAuthenticated,oauth2controller.token);

//msgs route
router
.route('/msg')
.post(Auth.isAuthenticated,msgController.sendMessage)
.get(Auth.isAuthenticated,msgController.AllMessages);

router
.route('/msg/:msg_id')
.get(Auth.isAuthenticated,msgController.displayMessage)
.delete(Auth.isAuthenticated,msgController.deleteMessage);


//start server on port 3000
app.listen(3000,function(){
	console.log("listening on port:3000");
});