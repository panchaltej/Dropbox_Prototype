var express = require('express');
var router = express.Router();
var mysql = require("./mysql");
var fileLocation = "";

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/getFiles', function (req, res, next) {

	//console.log(req);
	// var reqUserId = req.body.userDetail.UserId;
	var reqUserId = req.body.userId;
	var parentId = Number(req.body.parentId);
	var getUser='';

	console.log(parentId);
	if(parentId > 0){
		getUser = "SELECT * FROM Directory WHERE UserId = '"+reqUserId+"' AND ParentId='"+parentId+"'";
	}
	else{
		getUser = "SELECT * FROM Directory WHERE UserId = '"+reqUserId+"' AND ParentId IS NULL";
	}
	console.log("query is :" +getUser);
	
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
		}
		else{
			// if(result.length>0){
				console.log('Valid Login');
				res.status(201).json({ result});
				
			// }
			// else
			{
				// console.log("Invalid Login");
				// res.status(401).json({message: "Login failed"});
			}
		}
	},getUser);
});

router.post('/updateFile', function (req, res, next) {
	
		var reqFileId = req.body.Id;
		var reqIsStarred = req.body.IsStarred;
		var updateFileQuery = "";
	

		if(reqIsStarred == 0){
			updateFileQuery = "UPDATE Directory SET IsStarred = 1 WHERE Id = '"+reqFileId+"'";
		}
		else{
			updateFileQuery = "UPDATE Directory SET IsStarred = 0 WHERE Id = '"+reqFileId+"'";
		}
		console.log("star is :" +reqIsStarred);
		console.log("query is :" +updateFileQuery);
		
		mysql.fetchData(function(err, result){
			if(err){
				throw err;
			}
			else{
				console.log('Valid Update');
				res.status(201).json({ message : "Update Successfull"});
			}
		},updateFileQuery);
	});

router.post('/downloadFile', function (req, res, next) {
	
		var reqFileId = req.body.Id;
		var reqFileName = req.body.Name;
		var reqFilePath = req.body.Path;

		console.log("---------------------");
		console.log(reqFilePath);
		console.log(reqFileName);

		fileLocation = reqFilePath;
		res.download(fileLocation);
	});

router.get('/downloadFile', function (req, res, next) {
		res.download(fileLocation);
	});

router.post('/getSharedFiles', function (req, res, next) {
		var reqUserId = req.body.userId;
		var getShared='';
	
		// getShared = "SELECT * FROM Directory WHERE ',' && Members && ',' LIKE '%,"+reqUserId+",%'";
		getShared = "SELECT * FROM Directory WHERE Members IS NOT NULL";
		
		console.log("query is :" +getShared);
		
		mysql.fetchData(function(err, result){
			if(err){
				throw err;
			}
			else{
				console.log('Valid Login');
				var filelist = [];
				var members;
				for(var i=0; i<result.length; i++){
					members = result[i].Members;
					var arrMembers = members.split(",");
					if(arrMembers.indexOf(reqUserId)>=0){
						filelist.push(result[i])
					}
				}
				console.log("======", filelist);
				res.status(201).json( {filelist});
			}
		},getShared);
	});

router.post('/setSharing', function (req, res, next) {
	var fileitem = req.body.file;
	var fileId = fileitem.Id;
	var members= req.body.members;

	// getShared = "SELECT * FROM Directory WHERE UserId = '"+reqUserId+"'";
	var getFile = "SELECT * FROM Directory WHERE Id = "+fileId+"";
	
	console.log("query is :" +getFile);
	
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
		}
		else{
			console.log('Valid Login');
			
			var currentMembers = result[0].Members;
			var newMembers = currentMembers + members +",";
			var updateSharing = "UPDATE Directory SET Members = '"+newMembers+"' WHERE Id = "+fileId+"";
			
			console.log("query is :" +updateSharing);
			
			mysql.fetchData(function(err, result){
				if(err){
					throw err;
				}
				else{
					console.log('Valid Login');
					res.status(200);
				}
			},updateSharing);



		}
	},getFile);
});

module.exports = router;