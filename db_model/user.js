const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        min:3,
        max:20,
        require:true,
        unique:true
    },
    email:{
        type:String,
        max:50,
        unique:true,
        require:true
    },
    pass:{
        type:String,
        min:6,
        require:true
    },
    profilePicture:{
        type:String,
        default:""
    },
    followers:{
        type:Array,
        default:""
    },
    following:{
        type:Array,
        default:""
    },
    desc:{
      type:String,
      max:200,
      default:""
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    city:{
        type:String,
        max:50,
        default:""
    },
    country:{
        type:String,
        max:50,
        default:""
    },
    relationship:{
        type:Number,
        enum:[1,2,3]
    }

},{timestamps:true})
const user = mongoose.model('user',userSchema);
module.exports={user}; 