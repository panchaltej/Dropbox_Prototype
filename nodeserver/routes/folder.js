var express = require('express');
var router = express.Router();
var mysql = require("./mysql");
const fs = require('fs');

router.post('/createFolder', function (req, res, next) {

    //console.log(req);
    var reqUserId = req.body.userDetail.UserId;
    var parentId = Number(req.body.parentId);
    var reqFolderName = req.body.foldername;

    var getPath = "SELECT * FROM Directory WHERE Id=" + parentId + "";
    var folderpath = '';
    var newfolderpath = '';
    var addFolder = "";
    console.log("GetPath: " + getPath);

    if (parentId > 0) {
        mysql.fetchData(function (err, result) {
                if (err) {
                    throw err;
                } else {
                    console.log("query : " + result);
                    folderpath = result[0].Path;
                    newfolderpath = folderpath + "/" + parentId;
                    addFolder = "INSERT INTO Directory(Name, Type, Members, IsStarred, UserId, ParentId, Path) Va" +
                            "lues ('" + reqFolderName + "',1,'',0," + reqUserId + "," + parentId + ",'" + newfolderpath + "')";

                            
                    
                    mysql.fetchData(function (err, result) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('Valid folder');
                            //console.log(result);
                            // fs.mkdirSync("./files/"+ reqUserId+ newfolderpath + "/"+ result.insertId);
                            fs.mkdirSync("./files/"+ newfolderpath+ "/" + result.insertId);
                            var datenow = new Date();
                            addActivityQuery = "INSERT INTO Activity(Description, UserId, ActivityTime) Values ( 'Created Folder "+reqFolderName+"'," + reqUserId + ",'" + datenow + "')";
                            
                                    console.log("inner query : " + addActivityQuery);
                                    mysql.fetchData(function (err, result) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            console.log("Activity Added");
                                        }

                                    }, addActivityQuery);

                        }
                    }, addFolder);
                    res.end();

                }
            }, getPath);
    } else {
        newfolderpath = reqUserId;
        addFolder = "INSERT INTO Directory(Name, Type, Members, IsStarred, UserId, path) Values ('" + reqFolderName + "',1,'',0," + reqUserId + ", '" + newfolderpath + "')";

        console.log("outer query : " + addFolder);
        mysql.fetchData(function (err, result) {
            if (err) {
                throw err;
            } else {
                console.log('Valid folder');
                if(!fs.existsSync('./files/'+reqUserId))
                fs.mkdirSync('./files/'+reqUserId);
                fs.mkdirSync("./files/"+ reqUserId + "/"+ result.insertId);

                var datenow = new Date();
                addActivityQuery = "INSERT INTO Activity(Description, UserId, ActivityTime) Values ( 'Created Folder "+reqFolderName+"'," + reqUserId + ",'" + datenow + "')";
                        console.log("inner query : " + addActivityQuery);
                        mysql.fetchData(function (err, result) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("Activity Added");
                            }
                        }, addActivityQuery);
            }
        }, addFolder);
        res.end();
    }
});

module.exports = router;