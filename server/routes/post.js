const { Router } = require("express")
const router = Router()
const mongoose = require("mongoose")
const Post = mongoose.model("Post")
const login = require("../middleware/login")

router.get('/allposts', login, (req,res) => {
    Post.find()
        .populate("postedBy", "_id name picture")
        .populate("comments.postedBy", '_id name picture')
        .then(posts=> {
            res.json({posts})
        }).catch(err=>console.log(err))
})
router.post("/createpost", login, (req,res)=>{
    const { title, body, picture } = req.body
    if (!title || !body || !picture ){
        return res.status(422).json({error: "Please add all the fields"})
    }
    const post = new Post({title, body, photo: picture, postedBy:req.user })

    post.save().then(result=>{
        res.json({post: result})
    }).catch(err=> console.log(err))
})

router.get('/myposts', login,(req,res)=>{
    Post.find({postedBy: req.user._id})
        .populate("postedBy", "_id, name")
        .then(myposts=>{res.json(myposts)})
        .catch(err=>console.log(err))
})

router.put('/like', login, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes:req.user._id}
    },{
        new:true
    }
    ).exec((err,result)=>{
        if (err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike', login, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
            $pull:{likes:req.user._id}
        },{
            new:true
        }
    ).exec((err,result)=>{
        if (err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comments', login, (req,res)=>{
    const comments = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments}
    },
    {new:true}
    )
        .populate("postedBy", "_id name")
        .populate('comments.postedBy', '_id name picture').exec((err, result)=>{
        if (err){
            return res.status(422).json({error:err})
        }else{
            return res.json(result)
        }
    })
})

router.delete('/deletepost/:postId', login, (req,res)=>{
    Post.findOne({_id: req.params.postId})
        .populate("postedBy", '_id')
        .exec((err, post)=>{
            if (err || !post){
                return res.status(422).json({error: err})
            }
            if (post.postedBy._id.toString() === req.user._id.toString()){
                post.remove()
                    .then(result=>{
                        res.json(result)
                    })
                    .catch(err=>console.log(err))

            }
        })
})

// router.get('/getsubscribepost', login, (req, res)=>{
//     Post.find({postedBy: {$in: req.user.following}})
//         .populate("postedBy", "_id name")
//         .then(posts=>res.json({posts}))
//
// })

module.exports = router