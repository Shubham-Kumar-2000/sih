var express = require('express');
var router = express.Router();
var fake=require('faker');
var mentor=require('../model/mentor')
function randive(num){
    if(Math.floor(Math.random()*2)==0)
    return num;
    else
    return (0-num);
}
function minMaxScaler(val,min,max){
    if(min < 0){
        max += 0 - min;
        val += 0 - min;
        min = 0;
      }
      // Shift values from 0 - max
      val = val - min;
      max = max - min;
      return Math.max(0, Math.min(1, val / max));
}
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
        ratings:Math.floor(Math.random()*5)+1
    }
    i=1;
    while(i<data.ratingCount){
        data.ratings=(data.ratings+Math.floor(Math.random()*5)+1);
        i=i+1;
    }
    data.ratings=data.ratings/data.ratingCount;
    let num=Math.floor(Math.random()*12)+1;
    i=0;
    let domainData=[
        {
            totalYrs:0,
            maxWorth:0,
            yrsOnMax:0,
            count:0
        },{
            totalYrs:0,
            maxWorth:0,
            yrsOnMax:0,
            count:0
        },{
            totalYrs:0,
            maxWorth:0,
            yrsOnMax:0,
            count:0
        },{
            totalYrs:0,
            maxWorth:0,
            yrsOnMax:0,
            count:0
        },{
            totalYrs:0,
            maxWorth:0,
            yrsOnMax:0,
            count:0
        },{
            totalYrs:0,
            maxWorth:0,
            yrsOnMax:0,
            count:0
        },{
            totalYrs:0,
            maxWorth:0,
            yrsOnMax:0,
            count:0
        },{
            totalYrs:0,
            maxWorth:0,
            yrsOnMax:0,
            count:0
        }
    ];
    let maxWorth=0;
    let totalYrs=0;
    while(i<num){
        let yrs=Math.floor(Math.random()*8)+1;
        let ind=Math.floor(Math.random()*8);
        let worths=Math.floor(Math.random()*worth[Math.floor(Math.random()*5)]);
        data.startUps.push({
            years:yrs,
            companyName:fake.company.companyName(),
            companyWorth:worths,
            mentorFeild:bfeilds[ind]
        });
        if(worths>maxWorth)
        maxWorth=worths;
        domainData[ind].count++;
        domainData[ind].totalYrs+=yrs;
        totalYrs+=yrs;
        if(domainData[ind].maxWorth<worths){
            domainData[ind].maxWorth=worths;
            domainData[ind].yrsOnMax=yrs
        }
        i=i+1;
    }
    ratingCoef=minMaxScaler(data.ratings*(data.ratingCount/3)+randive(Math.floor(Math.random()*10)),-20,5*(100/3))*2;
    data.domainData=domainData;
    data.ratingCoef=ratingCoef;
    i=0;
    while(i<8){
        data[bfeilds[i]]=((ratingCoef*2)*(((domainData[i].maxWorth/maxWorth)*domainData[i].yrsOnMax)+domainData[i].totalYrs/totalYrs+domainData[i].count/data.startUps.length)+Math.pow(1.07,data.workingExp))*Math.pow(1.012,data.Age)+(3*0.6/(3*data.educationTier));
        data[bfeilds[i]]+=minMaxScaler(totalYrs,0,totalYrs+data.workingExp+data.Age)*data.startUps.length*0.3;
        if(i==4){
            data[bfeilds[i]]+=(3*0.4/(3*data.educationTier))
        }
        if(data.educationFeild==efeilds[i])
        data[bfeilds[i]]*=1.5;
        else
        data[bfeilds[i]]*=0.9;
        if(data.biasedFeild==bfeilds[i])
        data[bfeilds[i]]+=1;
        data[bfeilds[i]]=Math.ceil(minMaxScaler(data[bfeilds[i]],1,10)*10)
        i++;
    }
    res.status(200).json(data);
})
router.post('/add',function(req, res, next) {
    console.log(req.body)
    let start=[];
    let i=0;
    while(i<req.body.statUpLength)
    {
        start.push({
            years:parseInt(req.body['startUps['+i+'][years]']),
            companyName:req.body['startUps['+i+'][companyName]'],
            companyWorth:req.body['startUps['+i+'][companyWorth]'],
            mentorFeild:req.body['startUps['+i+'][mentorFeild]']
        })
        i=i+1
    }
    let data={
        name:req.body.name,
        Age:req.body.Age,
        educationTier:req.body.educationTier,
        workingExp:req.body.workingExp,
        fees:req.body.fees,
        biasedFeild:req.body.biasedFeild,
        educationFeild:req.body.educationFeild,
        ratingCount:req.body.ratingCount,
        startUps:start,
        ratings:req.body.ratings,
        tech:req.body.tech,
        finance:req.body.finance,
        operation:req.body.operation,
        law:req.body.law,
        connection:req.body.connection,
        humanResource:req.body.humanResource,
        marketing:req.body.marketing,
        overall:req.body.overall
    }
    let men=new mentor(data)
    men.save().then(result=>{
        res.status(200).json({err:false,data:result})
    }).catch(err=>{
        res.status(200).json({err:true,msg:err})
    })
})
router.get('/count/',function(req, res, next) {
    mentor.find(function(err,result){
        if(err)
        res.render('showViews',{
            count:0,
            err:err
        })
        else
        res.render('showViews',{
            count:result.length,
            err:err
        })
    })
})
module.exports = router;