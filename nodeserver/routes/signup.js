var express = require('express');
var router = express.Router();
var mysql = require("./mysql")

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/doSignup', function (req, res, next) {

    var reqFirstname = req.body.firstname;
    var reqLastname = req.body.lastname;
    var reqEmail = req.body.emailid;
    var reqPassword = req.body.password;

    var addUser = "INSERT INTO Users(FirstName, LastName, EmailId, Password) Values ('"+reqFirstname+"','"+reqLastname+"','"+reqEmail+"','"+reqPassword+"')";
	
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
		}
		else{
            console.log('Valid SignUp');
            res.status(201).json({message: "SignUp successful"});
		}
	},addUser);
});

module.exports = router;