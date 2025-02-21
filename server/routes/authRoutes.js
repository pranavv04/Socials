const express = require('express')
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const { generateToken} = require('../jwt')

router.post('/signin' , async(req,res)=>{
 try {
    const data = req.body;
    const newUser = User(data);
    const response = await newUser.save();
    console.log("New user data saved")

    const payload = {
        id: response.id,
        username: response.username,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("token is " + token);

    res.status(200).json({response : response , token : token})
 } catch (error) {
    console.log(error);
    res.status(500).json({message : "Internal server error"})
 }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(404).json({ error: 'Invalid username or password' });
        }

        const payload = {
            id: user.id,
            username: user.username,
        };

        const token = generateToken(payload);

        res.json({
            token,
            userId: user._id,  // ✅ Send userId properly
            username: user.username,
            profilePicture: user.profilePicture || "/uploads/default-avatar.jpg",
        });
        

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.post('/logout' , (req,res)=>{
    res.status(200).json({message : "Logged out successfully"})
})

router.get('/me' , async(req,res)=>{
    try {
        const {username} = req.body;
        const user = await User.findOne({username}).select('-password');

        if(!user){
            return res.status(404).json({error : 'User not found'})
        }
       res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal server error"})
    }
})

module.exports = router