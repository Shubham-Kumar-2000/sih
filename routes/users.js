var express = require('express');
var router = express.Router();
var UserId=require('uniqid');
const User = require('../model/user');
var sgMail= require('@sendgrid/mail');
let md5 = require('md5');
router.get('/confirm/:id', function(req, res, next) {

  let user={
    tempdata:req.params.id,
    tempAccount:true
  }
  User.findOne(user,function(err,result){
    if(err){
      console.log(err);
      res.status(200).json({error:true,msg:'Database Error'});
    }
    else{
      if(result==null){
        res.status(200).json({error:true,msg:'Temporary account not found'});
      }
      else{
        result.tempAccount=false;
        result.loggedin=req.connection.remoteAddress
        let data=new User(result);
        data.save().then((userdata)=>{
          res.status(200).json({error:false,msg:'Account Verified',email:result.email});
        }).catch((error)=>{
          res.status(202).json({error:true,'msg':'Unable to verify account, Please try again later !'});
        })
      }
    }
  })
});
router.post('/signUP', function(req, res, next) {
  let user={
    email:req.body.email,
    password:md5(req.body.password),
    loggedin:"",
    userid:UserId(),
    tempAccount:true,
    solutions:[],
    contest:null
  };
  User.find({email:req.body.email}).then((result)=> {
    if(result===[])
    result.length=0;
    if(result.length<1)
    {
      let loguser={loggedin:req.connection.remoteAddress
      };
      let outUser={
        loggedin:'0'
      };
      User.update(loguser,outUser,{multi:true},function(errors,raw){
        if(errors){
          console.log(errors);
          res.status(202).json({'msg':'Unable to SignUp Please try again later !',sign:false});
          return;
        }
        user.tempdata=md5(user.userid);
      let data=new User(user);
      data.save().then((userdata)=>{
        sgMail.setApiKey('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');
        const msg = {
          to: user.email,
          from: 'shukhu10@gmail.com',
          subject:'Email Verify',
          text: 'click on this link to verify http://localhost:4000/confirm/'+user.tempdata,
          html: '<strong>Click <a href="http://localhost:4000/confirm/'+user.tempdata+'">Here</a>. To Verify Account!!!!!!<strong>',
        };
        sgMail.send(msg).catch(err=>{
          console.log(err.response.body.errors)
        });
        res.status(200).json({'sign':true});
      }).catch((error)=>{
        console.log(error)
        res.status(202).json({'msg':'Unable to SignUp Please try again later !',sign:false});
      })})
    }
    else
    {
      res.status(202).json({'sign':false,'msg':"email taken"});
    }
  });
  
  
});

router.post("/logIn",function(req, res, next) {
  let user={
    email:req.body.email,
    password:md5(req.body.password),
    tempAccount:false
  };
  User.findOne(user,function(err,result){
    
    if(err)
    {
      console.log(err);
      res.status(500);
    }
    else
    {
      if(result==null)
      {
        res.status(200).json({'msg':'Invalid credentials',login:false});
      }
      else{
        
        if(result.loggedin==="0"||req.body.confirm==='1')
        {
          let loguser={loggedin:req.connection.remoteAddress
          };
          let outUser={
            loggedin:'0'
          };
          User.update(loguser,outUser,{multi:true},function(errors,raw){
            if(errors){
              console.log(errors);
              res.status(200).json({'msg':'Unable to Login Please try again later !',login:false});
              return;}
          result.loggedin=req.connection.remoteAddress;
          let data=new User(result);
          data.save().then(userdata=>{
            res.status(200).json({login:true,email:userdata.email});
          }).catch(err=>{
            console.log(err);
            res.status(200).json({'msg':'Unable to Login Please try again later !',login:false});
          })});
        }
        else
        res.status(200).json({'msg':'Do you want to disconnect your previous device?',confirm:1,login:false});
      }
    }
  })
}
)
router.post("/isLoggedIn",function(req, res, next) {
  let user={
    loggedin:req.connection.remoteAddress,
    email:req.body.email,
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
        res.status(200).json({loggedin:true,userid:result.userid});
      }
    }
  })
})
router.post("/logOut",function(req,res,next){
  let user={loggedin:req.connection.remoteAddress
};
let newUser={
  loggedin:'0'
};
User.update(user,newUser,{multi:true},function(errors,raw){
  console.log(errors,raw)
  res.status(200).json({loggedout:true});
})
});
router.post("/changePassword",function(req, res, next) {
  let user={
    loggedin:req.connection.remoteAddress,
    email:req.body.email,
    password:md5(req.body.oldPassword),
    tempAccount:false
  }
  User.findOne(user,function(err,result){
    if(err){
      console.log(err);
      res.status(200).json({error:true,msg:'Database Error'});
    }
    else{
      if(result==null){
        res.status(200).json({error:true,msg:'Auth failed'});
      }
      else{
        console.log(req.body.newPassword)
        result.tempdata=md5(req.body.newPassword);
        result.tempPassword=true;
        let data=new User(result);
        data.save().then((userdata)=>{
          sgMail.setApiKey('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');
        const msg = {
          to: user.email,
          from: 'shukhu10@gmail.com',
          subject:'Change Password',
          text: 'click on this link to verify http://localhost:4000/confirmpassword/'+result.email+'/'+result.tempdata,
          html: '<strong>Click <a href="http://localhost:4000/confirmpassword/'+result.email+'/'+result.tempdata+'">Here</a>. To Change Password!!!!!!<strong>',
        };
        sgMail.send(msg);
          res.status(200).json({error:false,msg:'Password Changing mail sent'});
        }).catch((error)=>{
          res.status(202).json({error:true,'msg':'Unable to change password, Please try again later !'});
        })
      }
    }
  })
});
router.get('/confirmPassword/:mail/:id', function(req, res, next) {

  let user={
    email:req.params.mail,
    tempdata:req.params.id,
    tempPassword:true
  }
  User.findOne(user,function(err,result){
    if(err){
      console.log(err);
      res.status(200).json({error:true,msg:'Database Error'});
    }
    else{
      if(result==null){
        res.status(200).json({error:true,msg:'Account not found'});
      }
      else{
        result.tempPassword=false;
        result.password=result.tempdata;
        let data=new User(result);
        data.save().then((userdata)=>{
          res.status(200).json({error:false,msg:'Password changed'});
        }).catch((error)=>{
          res.status(202).json({error:true,'msg':'Unable to change password, Please try again later !'});
        })
      }
    }
  })
});
module.exports = router;
