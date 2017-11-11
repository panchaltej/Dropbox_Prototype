var express = require('express');
var router = express.Router();
var mysql = require("./mysql");
var CryptoJS = require("crypto-js");

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/doLogin', function (req, res, next) {

    // var reqUsername = req.body.username;
	// var reqPassword = req.body.password;

	var bytes  = CryptoJS.AES.decrypt(req.body.EncPassword.toString(), '123');
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);

	var reqUsername = req.body.EmailId;
    var reqPassword = req.body.Password;

    var getUser = "SELECT * FROM Users WHERE EmailId = '"+reqUsername+"' and Password = '"+reqPassword+"'";
	console.log("query is :" +getUser);
	
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
		}
		else{
			if(result.length>0){
				console.log('Valid Login');
				res.status(201).json({message: "Login Succcessful"});
			}
			else
			{
				console.log("Invalid Login");
				res.status(401).json({message: "Login failed"})
			}
		}
	},getUser);
});

module.exports = router;