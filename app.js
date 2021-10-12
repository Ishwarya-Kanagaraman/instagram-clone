const express=require('express');
const app=express();
const mongoose=require("mongoose");
const PORT=process.env.PORT || 5000;
 const cors=require('cors');

// connecting to database


const {MONGO_URL}=require('./config/keys.js');

mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,useUnifiedTopology:true
});
mongoose.connection.on('connected',()=>{
    console.log("MongoDB is connected Yeah..!");
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err);
})
require('./models/user.js')
require('./models/post.js')

// using builtin middleware
app.use(express.json());
app.use(cors());
app.use (require('./routes/auth.js'));
app.use (require('./routes/Post.js'));
app.use (require('./routes/user'));


if(process.env.NODE_ENV=="production"){
    app.use(express.static('instagram-client1/build'))
    const path=require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'instagram-client1','build','index.html'))
    })
}

app.listen(PORT,()=>console.log("Server is started at PORT ",PORT))