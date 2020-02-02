var express = require('express');
var router = express.Router();
var ejs=require('ejs');
var path = require('path');
var fs = require('fs');
/* GET home page. */
router.get('/confirm/:tmp', function(req, res, next) {
  
  
  res.render('confirm', { 
    id:req.params.tmp,
    email:undefined,
    mode:1
  });
});
router.get('/confirmpassword/:email/:tmp', function(req, res, next) {
  
  
  res.render('confirm', { 
    id:req.params.tmp,
    mode:0,
    email:req.params.email
  });
});
router.get('/login', function(req, res, next) {
  
  
  res.render('login', { 
    title:'Login',
    signup:false
  });
});
router.get('/signUp', function(req, res, next) {
  
  
  res.render('login', { 
    title:'SignUp',
    signup:true
  });
});
router.get('/',function(req, res, next) {
  console.log(req.body);
  res.render('mentor', {});
})

module.exports = router;
