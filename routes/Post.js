const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

// to get all the post
router.get("/allpost",requireLogin, (req, res) => {
  Post.find()
    // after finding the record of particular id ,
    //populate methods populated the data of that record to this object
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort('-createdAt')
    .then((posts) => res.json({ posts }))
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getsubpost",requireLogin, (req, res) => {
  // if postedBy is in following list
  Post.find({postedBy:{$in:[req.user.following]}})
    // after finding the record of particular id ,
    //populate methods populated the data of that record to this object
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort('-createdAt')
    .then((posts) => res.json({ posts }))
    .catch((err) => {
      console.log(err);
    });
});

// to create a post
router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(442).json({ error: "Provide all the fields" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// to get all posts by a particular user
// have to provide token in the header since we given requireLogin
router.get("/myposts", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name pic")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.put('/like',requireLogin,(req,res)=>{
  
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    else{
      res.json(result)
    }
  })
})
router.put('/unlike',requireLogin,(req,res)=>{
  
  Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    else{
      res.json(result)
    }
  })
})
router.put('/comment',requireLogin,(req,res)=>{
  const comment={
    text:req.body.text,
    postedBy:req.user._id
  }
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{comments:comment}
  },{
    new:true
  })
  .populate("comments.postedBy","_id name pic")
  .populate("postedBy","_id name pic")
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }
    else{
      res.json(result)
    }
  })
})

router.delete("/deletepost/:postId",requireLogin,(req,res)=>{
  Post.findOne({_id:req.params.postId})
  .populate("postedBy","_id")
  .exec((err,post)=>{
    if(err || !post){
      return res.status(422).json({error:err})
    }
    if(post.postedBy._id.toString()===req.user._id.toString()){
           post.remove()
           .then(result=>{
             res.json(result)
           }).catch(err=>{
             console.log(err)
           })
    }
  })
})


// router.put("/updateprofile",requireLogin,(req,res)=>{
//   const {name,email,pic}=req.body;
//   User.findByIdAndUpdate(req.user._id,
        
//       {$set:{pic,name,email}},{new:true},
//       (err,result)=>{
//           if(err){
//               console.log(err)
//               return res.status(422).json({error:"cannot post pic"})
//           }
//          res.json(result)
//       })
// })
 
module.exports = router;
