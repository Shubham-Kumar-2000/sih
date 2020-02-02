const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var replySchema = new Schema(
    {
      'replyId':{
                    type: String,
            unique: true,
      },
      'commentId':{
                  type:String
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
    
    module.exports = mongoose.model('Reply', replySchema);
    