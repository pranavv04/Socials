const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Send a message
router.post('/send', async (req, res) => {
    try {
        const { sender, receiver, content } = req.body; // ✅ Fixed "receiver" field name

        if (!sender || !receiver || !content) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newMessage = new Message({ sender, receiver, content });
        await newMessage.save();

        res.status(200).json({ message: "Message sent", data: newMessage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get chat between two users
router.get('/chat/:user1/:user2', async (req, res) => {
    try {
        const { user1, user2 } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: user2 }, // ✅ Fixed "receiver" field name
                { sender: user2, receiver: user1 },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
