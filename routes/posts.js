const mongoose= require('mongoose');
const express = require('express');
const router = express.Router();
const post = require('../db_model/posts');
const posts = post.posts;
const user = require('../db_model/user').user;

// create a post
router.post('/',async (req,res)=>{
    const newPost = new posts(req.body);
    try{
     const savedPost = await newPost.save();
     res.json({success:true,message:"post created",data:savedPost});
     return;
    }catch(err) {
      console.log(err);
    }
})
//update a post
router.put('/:id',async (req,res)=>{
    const update = await posts.findOne({id:req.params.id});
    try{
        if(req.params.id===req.body.id) { 
        console.log(update);
         await update.updateOne({$set:req.body});
         res.json({success:true,message:"updated",data:update});
        }else {
            res.json({success:false,message:"You can only update your post"});
        }
    }catch(err) {
        res.json(err);
    }
})
//delete a post
router.delete('/:id',async (req,res)=>{
    const toDelete = await posts.findOne({id:req.params.id});
    try{
        if(req.params.id===req.body.id) { 
         await toDelete.deleteOne();
         res.json({success:true,message:"deleted"});
        }else {
            res.json({success:false,message:"You can only delete your post"});
        }
    }catch(err) {
        res.json(err);
    }
})
//like a post
router.put('/:id/like',async(req,res)=>{
    const toLike = await posts.findOne({id:req.params.id});

    try{
      if(toLike && toLike.likes.includes(req.body.id)) {
         await toLike.updateOne({$pull:{likes:req.body.id}});
         res.json({success:true,message:"Post disliked"});
         return;
      } else {
         if(toLike && !toLike.likes.includes(req.body.id)) { 
            await toLike.updateOne({$push:{likes:req.body.id}});
            res.json({success:true,message:"post Liked"});
            return;
         }
         else {
            res.json({success:false,message:"user does not exist!"});
            return;
         }
      }
    }catch(err){
        console.log(err);
        res.json({success:false,message:"Internal error"});
    }
})
//get a post
router.get('/:id/post',async (req,res)=>{
    try{
     const toGet = await posts.findById(req.params.id);
     res.json({success:true,post:toGet});
     return;
    }catch(err){
        res.status(500).json({success:false,message:"Could not find post!"});
        return;
    }
    
})

//get all post
router.get('/timeline/all', async(req,res)=>{
  try{
    const currentUser = await user.findById(req.body.id);
    const userPosts = await posts.find({id:currentUser._id});
    const friendPosts = await Promise.all(
        currentUser.followers.map((friendId)=>{
           return posts.find({id:friendId});
        })
    );
    const allposts =[userPosts,...friendPosts];
    res.json({success:true, posts:allposts});
  }catch(err){
    res.status(500).json({success:false,message:"Internal error!"});
    return;
  }
})

module.exports={router};