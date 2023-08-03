const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    id:{
        type:String,
        require:true
    },
    desc:{
        type:String,
        max:500
    },
    img:{
        type:String
    },
    likes:{
        type:Array,
        default:[]
    }
},

{timestamps:true});

const posts = mongoose.model("Posts",postSchema);
module.exports={posts};