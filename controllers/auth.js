var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var mongoose = require('mongoose');

passport.use('basic',new BasicStrategy(
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
	function(id,secret,done){

		Client.findOne({id:id},function(err,client){
			if(err)
				return done(err);
			if(!client || client.secret !== secret)
				return done(null,false);
			
			return done(null,client);
		});
	})
);

passport.use('bearer',new BearerStrategy(function(token,callback){
	Token.findOne({value:token},function(err,token){
			if(err)
				return callback(err);
			if(!token)
				return callback(null,false);
			User.findById(token.userId,function(err,user){
				if(err)
					return callback(err);
				if(!user)
					return callback(null,false);
				callback(null,user,{scope:"*"});
			});
		});
	})
);

module.exports.isAuthenticated = passport.authenticate(['basic','bearer'],{session:false}); 
module.exports.isClientAuthenticated = passport.authenticate('clients',{session:false});
module.exports.isBearerAuthenticated = passport.authenticate('bearer',{session:false});