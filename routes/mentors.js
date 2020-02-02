var express = require('express');
var router = express.Router();
var fake=require('faker');
var mentor=require('../model/mentor')
router.get('/metadata',function(req, res, next) {
    let bfeilds=['tech','finance','operation','law','connection','humanResource','marketing','overall'];
    let efeilds=['tech','finance','operation','law','connection','humanResource','marketing','others'];
    let worth=[10000,30000,50000,100000,500000];
    let data={
        name:fake.name.firstName()+" "+fake.name.lastName(),
        Age:Math.floor(Math.random()*30)+25,
        educationTier:Math.floor(Math.random()*3)+1,
        workingExp:Math.floor(Math.random()*15)+1,
        fees:Math.floor(Math.random()*1000),
        biasedFeild:bfeilds[Math.floor(Math.random()*8)],
        educationFeild:efeilds[Math.floor(Math.random()*8)],
        ratingCount:Math.floor(Math.random()*100)+1,
        startUps:[],
        ratings:Math.floor(Math.random()*5)
    }
    i=1;
    while(i<data.ratingCount){
        data.ratings=(data.ratings+Math.floor(Math.random()*5));
        i=i+1;
    }
    data.ratings=data.ratings/data.ratingCount;
    let num=Math.floor(Math.random()*12)+1;
    i=0;
    while(i<num){
        data.startUps.push({
            years:Math.floor(Math.random()*8),
            companyName:fake.company.companyName(),
            companyWorth:Math.floor(Math.random()*worth[Math.floor(Math.random()*5)]),
            mentorFeild:bfeilds[Math.floor(Math.random()*8)]
        })
        i=i+1
    }
    res.status(200).json(data);
})
router.post('/add',function(req, res, next) {
    let data={
        name:req.body.name,
        Age:req.body.Age,
        educationTier:req.body.educationTier,
        workingExp:req.body.workingExp,
        fees:req.body.fees,
        biasedFeild:req.body.biasedFeild,
        educationFeild:req.body.educationFeild,
        ratingCount:req.body.ratingCount,
        startUps:req.body.startUps,
        ratings:req.body.ratings,
        tech:req.body.tech,
        finance:req.body.finance,
        operation:req.body.operation,
        law:req.body.law,
        connection:req.body.connection,
        humanResource:req.body.humanResource,
        marketing:req.body.marketing,
        overall:req.body.overall,
    }
    let men=new mentor(data)
    men.save().then(result=>{
        res.status(200).json({err:false,data:result})
    }).catch(err=>{
        res.status(200).json({err:true,msg:err})
    })
})
module.exports = router;