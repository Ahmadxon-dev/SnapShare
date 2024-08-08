const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const User = mongoose.model("User")
const {JWT_SECRET} = require('../config/keys')
const login = require("../middleware/login")
router.get('/protected', login, (req,res)=>{
    res.send('hello user')
})

router.post("/signup", (req, res) => {
    const { name, email, password, picture } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: "Please fill all the fields" });
    }

    User.findOne({ email: email })
        .then(savedUser => {
            if (savedUser) {
                return res.status(400).json({ error: "User already exists with this email" });
            }
            bcrypt.hash(password, 10).then(hashedPass => {
                const user = new User({
                    email,
                    name,
                    password: hashedPass,
                    picture
                });
                return user.save();
            })
                .then(() => res.json({ msg: "added successfully" }))
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({ error: "Internal Server Error" });
                });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
        });
});


router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "add email or password" });
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(400).json({ error: "User not found with this email" });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        const { _id, name, email, followers, following, picture } = savedUser;
                        return res.json({ token: token, user: { _id, name, email, followers, following, picture } });
                    } else {
                        return res.status(400).json({ error: "Invalid Password" });
                    }
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({ error: "Internal Server Error" });
                });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
        });
});

module.exports = router
