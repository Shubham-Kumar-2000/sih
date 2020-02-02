var express = require('express');
var router = express.Router();
var newName=require('uniqid');
const User = require('../model/user');
var fs=require('fs');
var formidable=require('formidable');
var path=require('path');
router.post('/upload/', function(req, res, next) {
    newname=newName();
    var form = new formidable.IncomingForm({ 
        uploadDir:path.join( __dirname , '../tmp'),  // don't forget the __dirname here
        keepExtensions: true
      });
    form.parse(req, function (err, fields, files) {
        if(getExtension(files.filetoupload.name)!='mp4'){
            res.status(200).json({'err':true,'msg':'file format not supported'})
            return
        }
        let user={
            loggedin:req.connection.remoteAddress,
            userid:fields['userid'],
            tempAccount:false
          }
          User.findOne(user,function(err,result){
            if(err){
              console.log(err);
              res.status(500);
              return
            }
            else{
              if(result==null){
                res.status(200).json({loggedin:false});
              }
              else{
                var oldpath = files.filetoupload.path;
                if(!(fs.existsSync(path.join(__dirname,'../uploads/',fields['userid'])))){
                    fs.mkdirSync(path.join(__dirname,'../uploads/',fields['userid']));
                }
                if(result.files==null)
                result.files=[];
                result.files.push({'fileName':files.filetoupload.name,'url':newname+'.' + getExtension(files.filetoupload.name)})
                var newpath = path.join(__dirname,'../uploads/',fields['userid'],'/')+newname+'.' + getExtension(files.filetoupload.name);
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    let data=new User(result);
                    data.save().then((userdata)=>{
                    res.redirect('http://localhost:4000/')
                    res.status(200).json({error:false,msg:'Files Saved','url':'http://localhost:4000/api/media/getFile/'+result.email+'/'+newname+'.mp4'});
                    }).catch((error)=>{
                    res.status(202).json({error:true,'msg':'Unable to save file, Please try again later !'});
                    })
                });
              }
            }
          })
    });
});
router.post("/allFiles",function(req, res, next) {
    let user={
        loggedin:req.connection.remoteAddress,
        email:req.body.email,
        tempAccount:false
      }
      User.findOne(user,function(err,result){
        if(err){
          res.status(500);
        }
        else{
          if(result==null){
            res.status(200).json({loggedin:false});
          }
          else{
            res.status(200).json(result.files);
          }
        }
      })
});
router.get("/getFile/:email/:file",function(req, res, next) {
    let user={
        loggedin:req.connection.remoteAddress,
        email:req.params.email,
        tempAccount:false
      }
      
      User.findOne(user,function(err,result){
        if(err){
          console.log(err);
          res.status(500);
        }
        else{
          if(result==null){
            res.status(200).json({loggedin:false});
          }
          else{
            if(fs.existsSync(path.join(__dirname,'../uploads/'+result.userid+'/'+req.params.file)))
            res.sendFile(path.join(__dirname,'../uploads/'+result.userid+'/'+req.params.file));
            else
            res.status(404);
          }
        }
      })
});
function getExtension(name){
    return (/[.]/.exec(name)) ? /[^.]+$/.exec(name) : undefined;
}
module.exports = router;