const express=require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const router = express.Router();

const app = express();
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

app.use(bodyparser.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({extended:false}));
app.use(helmet());

app.use('/users',usersRoute.router);
app.use('/api/auth',authRoute.router);
app.use('/api/posts',postRoute.router);

dotenv.config();
  
mongoose.connect(process.env.MONGO_URI) 
.then(()=>{
    console.log('Connected to the database ...');
})
.catch((err)=>{
    console.log(err);
})

app.get('/',(req,res)=>{
    res.send('Hello')
})

app.all('*',(req,res)=>{
    res.send('Url not found!');
})
app.listen(process.env.PORT,()=>{
    console.log(`Server is listening to port: ${process.env.PORT} ...`);
})