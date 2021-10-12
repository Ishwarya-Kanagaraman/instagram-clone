const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto= require("crypto")
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/keys.js");
const requireLogin = require("../middleware/requireLogin.js");
const nodemailer = require("nodemailer");
const {SENDGRID_API,EMAIL}=require('../config/keys')
const sendgridTransport = require("nodemailer-sendgrid-transport");
//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

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API
    },
  })
);
// signup logic
router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res
      .status(422)
      .json({ error: "Please add all the required fields" });
  }
  // checking whether the user is already exists
  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exists with that email" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          name,
          email,
          password: hashedpassword,
          pic,
        });
        user
          .save()
          .then((user) => {
            transporter.sendMail({
              to: user.email,
              from: "ishwaryaraman324@gmail.com",
              subject: "signup success",
              html: `<h1>Welcome to Kuppu's instagram</h1>`,
            });
            res.json({ message: "signed up successfully!" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
// signin logic
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ error: "please provide both the  credentials" });
  }
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res
        .status(422)
        .json({ error: "No user found. Kindly Register and try again" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((isMatch) => {
        if (isMatch) {
          // res.json({message:"Logged in successfully"})
          const token = jwt.sign({ _id: savedUser._id }, SECRET_KEY);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.status(422).json({ error: "Invalid credentials" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post('/reset-password',(req,res)=>{
   crypto.randomBytes(32,(err,buffer)=>{
     if(err){
       console.log(err)
     }
     const token=buffer.toString("hex")
     User.findOne({email:req.body.email})
     .then(user=>{
       if(!user){
         return res.status(422).json({error:"User Doesn't exists with that email"})
       }
       user.resetToken  = token;
       user.expireToken = Date.now()+3600000// within 1hr
       user.save().then((result)=>{
         transporter.sendMail({
           to:user.email,
           from:"ishwaryaraman324@gmail.com",
           subject:"Password Reset",
           html:`
           <p>you requested for password reset</p>
           <h5>click on this <a href="${EMAIL}/reset/${token}"> link</a> to reset password</h5>
           `
         })
         res.json({message:"Check your email to reset password"})
       })
     })
   })
})

router.post('/new-password',(req,res)=>{
  const newPassword = req.body.password;
  const sentToken = req.body.token
  User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
  .then(user=>{
    if(!user){
      return res.status(422).json({message:"Session Expired, try again"})
    }
    bcrypt.hash(newPassword,12).then(hashedpassword=>{
      user.password=hashedpassword,
      user.resetToken=undefined,
      user.expireToken=undefined
      user.save().then((savedUser)=>{
        res.json({message:"password updated successfully"})
      })
    })
  }).catch(err=>{
    console.log(err)
  })
})
module.exports = router;
