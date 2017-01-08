var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Client = require('../models/client');
var mongoose = require('mongoose');

passport.use('users',new BasicStrategy(
	function(username,password,done){
		User.findOne({username:username},function(err,user){
			if(err)
				return done(err);
			if(!user)
				return done(null,false);
			user.verifyPassword(password,function(err,isMatch){
				if(err)
					return done(err);
				if(isMatch)
					return done(null,user);
				else
					return done(null,false);
			});
		});
	})
);


passport.use('clients',new BasicStrategy(
	{
		usernameField : "name",
		passwordField : "password"
	},
	function(name,password,done){

		Client.findOne({name:name},function(err,client){
			if(err)
				return done(err);
			if(!client)
				return done(null,false);
			client.verify(password,function(err,isMatch){
				if(err)
					return done(err);
				if(isMatch)
					return done(null,client);
				else
					return done(null,false);
			});
		});
	})
);

module.exports.isUserAuthenticated = passport.authenticate('users',{session:false}); 
module.exports.isClientAuthenticated = passport.authenticate('clients',{session:false});