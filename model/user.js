const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var userSchema = new Schema(
    {
      'email':{
                    type: String,
            unique: true,
      },
      'password':{
                  type:String,
            default:'password'
      },
      'tempAccount':{
            type: Boolean
      },
      'tempdata':{
            type:String
      },
      'tempPassword':{
            type:Boolean,
            default:false
      },
      'userid' : {
            type:String,
            unique:true
      },
      'loggedin' : {
            type : String
      },
      'files':{
            type : Array,
            default: []
      }
    });
    
    module.exports = mongoose.model('User', userSchema);
    