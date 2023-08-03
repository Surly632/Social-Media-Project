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

router.post('/signup',async(req,res)=>{
    const user = new userSchema.user({
        username:req.body.username,
        pass:req.body.pass,
        email:req.body.email
        });
    try{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.pass, salt);
        user.pass=hash;
        const user_ = await user.save();
        res.send({message:"Profile Created Successfully for the user",user:user}); 
        return;
    } catch(err){
        const exists =await userSchema.user.findOne({email:req.body.email});
        if(exists) {
            res.json({success:false,message:"User already exists!"});
            return;
        }
        res.json({success:false,message:"Could Not create Profile, Internal Error"});
        console.log(err);
    }
   
})

router.post('/login' , async (req,res)=>{
   const username  = req.body.username;
   const pass = req.body.pass;
   try{
    const user_ = await userSchema.user.find({username:username})
    if(!user_) {
        res.send('User not Found!');
        return;
    } else {
        const validpass = await bcrypt.compare(pass,user_[0].pass);
        if(!validpass){
            res.json({success:false,message:"wrong Credentials!"});
            return;
        } else {
             res.json({success:true,message:"login success!"});
             return;
        }
    }

   }catch(err) {
     console.log(err);
   }
})




module.exports={router};