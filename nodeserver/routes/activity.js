var express = require('express');
var router = express.Router();
var mysql = require("./mysql");

router.post('/getActivity', function (req, res, next) {

    var reqUserId = Number(req.body.userId);
    console.log("@@@@@@@@@@@@@@@2"+reqUserId);
    getActivity = "SELECT * FROM Activity WHERE UserId = '"+reqUserId+"' ORDER BY ActivityId DESC LIMIT 10";
	console.log("query is :" +getActivity);
	
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
		}
		else{
            console.log('Activity Fetched');
            res.status(201).json({ result});
		}
	},getActivity);
});

module.exports = router;