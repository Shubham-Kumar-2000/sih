var id=require('uniqid');
var Reply=require('../model/reply');
var Comment=require('../model/comment');

exports.get= function(req, res, next) {
    let reply={
        commentId:req.params.id,
        active:true
    };
    Reply.find(reply,function(err,result){
        if(err){
            res.status(200).json({err:true,msg:err})
            return;
        }
        if(!(Array.isArray(result) && result.length)){
            res.status(200).json({err:true,msg:"Still no replies"})
            return;
        }
        res.status(200).json({err:false,replies:result})
    })
}
exports.add= function(req, res, next) {
    let reply={
        commentId:req.body.commentId,
        content:req.body.text,
        replyId: id(),
        userId:req.body.user,
        userName:req.body.userName,
        profilePicUrl:req.body.profilePicUrl,
        likes:0,
        time:Date(),
        active:true
    };
    let comment={
        commentId: req.body.commentId,
        active:true
    };
    Comment.findOne(comment,function(err,result){
        if(err){
            res.status(500).json({
                err:true,
                msg:err,
            })
            return;
        }
        if(!result){
            res.status(500).json({
                err:true,
                msg:"Comment not found!!",
            })
            return;
        }
        let replyData=new Reply(reply);
        replyData.save().then(result=>{
            res.status(200).json({
                err:false,
                reply:reply
            })
        }).catch(err=>{
            res.status(200).json({
                err:true,
                msg:err
            })
        })
    })
}
exports.del= function(req, res, next) {
    let reply={
        replyId:req.body.replyId,
        commentId: req.body.commentId,
        active:true
    };
    if(!(reply.replyId && reply.commentId))
    {
        res.status(500).json({
            err:true,
            msg:'Bad Request',
        })
        return;
    }
    Reply.findOne(reply,function(err,result){
        if(err){
            res.status(500).json({
                err:true,
                msg:err,
            })
            return;
        }
        if(!result){
            res.status(500).json({
                err:true,
                msg:"Reply not found!!",
            })
            return;
        }
        result.active=false;
        result.save().then(com=>{
            res.status(200).json({err:false,msg:"Successfully deleted"})
        }).catch(err=>{
            res.status(500).json({
                err:true,
                msg:err,
            })
            return;
        })
    })
}
