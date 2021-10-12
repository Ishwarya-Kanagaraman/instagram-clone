const mongoose =require('mongoose');
const {ObjectId}=mongoose.Schema.Types;

const userSchema=new  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dcwjm82bj/image/upload/v1630336582/emptyProfile_f4ryzd.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
})
 mongoose.model("User",userSchema);