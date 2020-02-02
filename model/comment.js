const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var commentSchema = new Schema(
    {
      'commentId':{
                    type: String,
            unique: true,
      },
      'postId':{
                  type:String
      },
      'hasReply':{
            type: Boolean
      },
      'active':{
        type: Boolean
      },
      'userId':{
        type:String
      },
      'userName' : {
            type:String
      },
      'profilePicUrl' : {
            type : String
      },
      'content' : {
          type: String
      },
      'likes' : {
          type: Number,
          default:0
      },
      'time': {
          type: Date
      }
    });
    
    module.exports = mongoose.model('Comment', commentSchema);
    