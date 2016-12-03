var express = require('express');
var app = express();

var router = express.Router();

//use /api as main route.. for now
app.use('/api',router);

router.get('/',function(req,res,next) {

	res.json({head:"index" , message:"No No"});

});


//start server on port 3000
app.listen(3000,function(){
	console.log("listening on port:3000");
})