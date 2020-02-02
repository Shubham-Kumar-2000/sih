var id=require('uniqid');
var Comment=require('../model/comment');
exports.get= function(req, res, next) {
    let comment={
        postId:req.params.id,
        active:true
    };
    Comment.find(comment,function(err,result){
        if(err){
            res.status(200).json({err:true,msg:err})
            return;
        }
        res.status(200).json({err:false,comments:result})
    })
}
exports.add= function(req, res, next) {
    let comment={
        postId:req.body.postId,
        content:req.body.text,
        commentId: id(),
        hasReply:false,
        userId:req.body.user,
        userName:req.body.userName,
        profilePicUrl:req.body.profilePicUrl,
        likes:0,
        time:Date(),
        active:true
    };
    
    let commentData=new Comment(comment);
    commentData.save().then(result=>{
        res.status(200).json({
            err:false,
            comment:comment
        })
    }).catch(err=>{
        res.status(200).json({
            err:true,
            msg:err
        })
    })
}
exports.del= function(req, res, next) {
    let comment={
        postId:req.body.postId,
        commentId: req.body.commentId,
        active:true
    };
    if(!(comment.postId && comment.commentId))
    {
        res.status(500).json({
            err:true,
            msg:'Bad Request',
        })
        return;
    }
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
