const express = require('express')
const mongoose = require("mongoose");
const {mongo} = require("mongoose");
const router = express.Router()
const User = mongoose.model("User")
const Post = mongoose.model("Post")
const login = require('../middleware/login')

router.get("/user/:id", login, (req, res) => {
    User.findOne({_id: req.params.id})
        .select("-password")
        .then(user => {
            Post.find({postedBy: req.params.id})
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({error: err})
                    }
                    res.json({user, posts})
                })
        })
        .catch(err => res.status(404).json({error: "User not found"}))
})

router.put("/follow", login, (req, res) => {
    User.findByIdAndUpdate(req.body.followId,
        {
            $push: {followers: req.user._id}
        },
        {new: true},
        (err, result) => {
            if (err) {
                return res.status(422).json({error: err})
            }
            User.findByIdAndUpdate(req.user._id,
                {
                    $push:{following: req.body.followId}
                },
                {new:true},
                )
                .select("-password")
                .then(result=> res.json(result))
                .catch(err=>res.status(422).json({error:err}))
        }
    )

})

router.put("/unfollow", login, (req, res) => {
    User.findByIdAndUpdate(req.body.followId,
        {
            $pull: {followers: req.user._id}
        },
        {new: true},
        (err, result) => {
            if (err) {
                return res.status(422).json({error: err})
            }
            User.findByIdAndUpdate(req.user._id,
                {
                    $pull:{following: req.body.followId}
                },
                {new:true},
            )
                .select("-password")
                .then(result=> res.json(result))
                .catch(err=>res.status(422).json({error:err}))
        }
    )

})

router.put("/updatepicture", login, (req,res)=>{
    User.findByIdAndUpdate(req.user._id,
        {
            $set: {picture: req.body.picture}
        },
        {
            new:true
        },
        (err, result) =>{
            if (err) {
                return res.status(422).json({error:'Picture was not updated'})
            }
            res.json(result)

        })
})
router.put("/editname", login, (req,res)=>{
    User.findByIdAndUpdate(req.user._id,
        {
            $set: {name: req.body.name}
        },
        {
            new:true
        },
        (err, result) =>{
            if (err) {
                return res.status(422).json({error:'Name was not updated'})
            }
            res.json(result)

        })
})

router.post("/searchuser", (req,res)=>{
    const searchUserPanel = new RegExp("^" + req.body.query)
    User.find({email: { $regex: searchUserPanel}})
        .select("id name email picture")
        .then(user=>res.json({user}))
        .catch(err=> console.log(err))
})

module.exports = router