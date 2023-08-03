const express=require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const router = express.Router();
const bcrypt = require('bcrypt');
const userSchema = require('../db_model/user');
const app = express();

app.use(bodyparser.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({extended:false}));
app.use(helmet());

router.get('/',(req,res)=>{
    res.json({success:true});
})
/* Update User */
router.put('/:id', async (req,res)=>{
   const update = req.body;
   if(req.body.id===req.params.id || req.user.isAdmin) {
     if(req.body.pass) {
        try{
        const salt = await bcrypt.genSalt(10);
        req.body.pass = await bcrypt.hash(req.body.pass,salt);
        }catch(err){
            console.log(err);
        }
        try{
         await userSchema.user.findByIdAndUpdate(req.params.id,{$set:req.body});
         const user = await userSchema.user.findOne({_id:req.body.id});
         console.log(user);
         res.json({success:true,message:"updated successfully",user:user});
         return;
        }catch(err){
            console.log(err); 
        } 
     } else {
        res.json({success:false, message:"passwords don't match"});
        return;
     }
   } else{
     res.json({success:false, message:"You are not authorized!"});
     return;
   }
})

/* Delete User */
router.delete('/:id', async (req,res)=>{
    const update = req.body;
    if(req.body.id===req.params.id || req.user.isAdmin) {
         try{
          await userSchema.user.findByIdAndDelete(req.params.id,{$set:req.body});
          res.json({success:true,message:"Deleted successfully"});
          return;
         }catch(err){
             console.log(err); 
         } 
      } else {
         res.json({success:false, message:"passwords don't match"});
         return;
      }
 })
/* Get a user */
router.get('/:id', async (req,res)=>{
    const id = req.params.id;
    try {
        const user_ = await userSchema.user.findById(id);
        const {pass,updatedAt,createdAt,...data} = user_._doc;
        res.status(201).json({success:true,message:"User found",user:data});
        return;
    }catch(err) {
        res.status(404).json({success:false,message:"Internal Error"});
        return;
    }
})

/* Follow a user */
router.put('/:id/follow', async (req,res)=>{
    if(req.body.id===req.params.id) {
        res.json({success:false,message:"You can't follow yoursef"});
        return;
    }
    try{
        const follower = await userSchema.user.findById(req.body.id);
        const following = await userSchema.user.findById(req.params.id);
        await follower.updateOne({$push:{followers:req.params.id}});
        await following.updateOne({$push:{following:req.body.id}});
        res.json({success:true,message:"updated"});
    }catch(err) {
        console.log(err);
        res.json({success:false,message:"Internal Error"},);
        return;
    }
})
/* Unfollow a user */
router.put('/:id/unfollow', async (req,res)=>{
    if(req.body.id===req.params.id) {
        res.json({success:false,message:"You can't follow yoursef"});
        return;
    }
    try{
        const follower = await userSchema.user.findById(req.body.id);
        const following = await userSchema.user.findById(req.params.id);
        await follower.updateOne({$pull:{followers:req.params.id}});
        await following.updateOne({$pull:{following:req.body.id}});
        res.json({success:true,message:"updated"});
    }catch(err) {
        console.log(err);
        res.json({success:false,message:"Internal Error"},);
        return;
    }
})

module.exports={router};