var oauth2orize = require('oauth2orize');
var SHA256 = require('crypto-js/sha256');
var crypto = require('crypto');
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var Code = require('../models/code');

var server = oauth2orize.createServer();

server.serializeClient(function(client,done){
	return done(null,client._id);
});

server.deserializeClient(function(id,done){
	Client.findById(id,function(err,client){
		if(err)
			return done(err);
		return done(null,client);
	});
});

server.grant(oauth2orize.grant.code(function(client,redirectUri,user,ares,callback){
	var code = new Code({
		value : crypto.randomBytes(16).toString('hex'),
		clientId : client._id,
		redirecturi : redirectUri,
		userId : user._id
	});

	code.save(function(err){
		if(err)
			return callback(er);
		callback(null,code.value);
	});

}));

server.exchange(oauth2orize.exchange.code(function(client,code,redirectUri,callback){
	Code.findOne({value:code},function(err,authCode){
		if(err)
			return callback(err);
		if(authCode === undefined)
			return callback(null,false);	
		if(client._id.toString() !== authCode.clientId)
			return callback(null,false);
		if(redirectUri !== authCode.redirecturi)
			return callback(null,false);

		authCode.remove(function(err){
			if(err)
				return callback(err);
			var token = new Token({
				value : SHA256(crypto.randomBytes(20).toString('hex')),
				clientId : authCode.clientId,
				userId : authCode.userId
			});

			token.save(function(err){
				if(err)
					return callback(err);
				callback(null,token);
			});	
		});
	});
}));


exports.authorization = [
  server.authorization(function(clientId, redirectUri, callback) {

    Client.findOne({id:clientId}, function (err, client) {
      if (err) { return callback(err); }

      return callback(null, client, redirectUri);
    });
  }),
  function(req, res){
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
]

exports.decision = [
  server.decision()
]

exports.token = [
  server.token(),
  server.errorHandler()
]