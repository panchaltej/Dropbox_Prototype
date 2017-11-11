var express = require('express');
var router = express.Router();
var mysql = require("./mysql")

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/getUser', function (req, res, next) {

	var reqUsername = req.body.emailId;

    var getUser = "SELECT * FROM Users WHERE EmailId = '"+reqUsername+"'";
	console.log("query is :" +getUser);
	
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
		}
		else{
			if(result.length>0){
				console.log('Valid Login');
				res.status(201).json({
                    UserId: result[0].UserId,
                    FirstName: result[0].FirstName,
                    LastName: result[0].LastName,
                    EmailId: result[0].EmailId,
                    Password: result[0].Password,
                    Work: result[0].Work,
                    Education: result[0].Education,
                    Contact: result[0].Contact,
                    Interests: result[0].Interests
                });
			}
			else
			{
				console.log("Invalid Login");
				res.status(401).json({message: "Login failed"});
			}
		}
	},getUser);
});

router.post('/updateUser', function (req, res, next) {
	
		var reqUserEmail = req.body.EmailId;
		var reqUserFname = req.body.FirstName;
		var reqUserLname = req.body.LastName;
		var reqUserWork = req.body.Work;
		var reqUserEducation = req.body.Education;
		var reqUserContact = req.body.Contact;
		var reqUserInterests = req.body.Interests;

	
		var updateUser = "UPDATE Users SET FirstName='"+reqUserFname+"', LastName='"+reqUserLname+"', Work='"+reqUserWork+"', Education='"+reqUserEducation+"', Contact='"+reqUserContact+"', Interests='"+reqUserInterests+"' WHERE EmailId = '"+reqUserEmail+"'";
		console.log("query is :" +updateUser);
		
		mysql.fetchData(function(err, result){
			if(err){
				throw err;
			}
			else{
				console.log('Valid Login');
				res.status(200).json({ Message : "User Updated"});
			}
		},updateUser);
	});

module.exports = router;