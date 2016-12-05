var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

passport.use(new BasicStrategy(
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


module.exports.authenticate = passport.authenticate('basic',{session:false}); 