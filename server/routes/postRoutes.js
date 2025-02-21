const express = require('express')
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');


router.post('/createpost' , async(req,res)=>{
    try {
        const data = req.body;
        const newPost = await Post(data);
        const response = await newPost.save();
        if(!response){
            return res.status(404).json({error : "Internal server error"})
        }
        console.log("Post posted")
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Internal server error"})
    }
})

router.get('/' , async(req,res)=>{
    try {
        const data = await Post.find()
        .populate("user" , "username profilePicture")
        .populate("comments.user" , "username profilePicture");
        console.log("All posts fetched")
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Internal server error"})
    }
})

router.get('/:id' , async(req,res)=>{
    try {
        const postId = req.params.id;
        if(postId){
            const response = await Post.findById(postId);
            if(!response){
                return res.status(404).json({error : "Post not found"})
            }
            console.log("Post fetched")
            res.status(200).json(response)
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Internal server error"})
    }
})


router.put('/:id' , async(req,res)=>{
    try {
        const blogId = req.params.id;
        const updateBlog = req.body;

        const response = await Post.findByIdAndUpdate(blogId , updateBlog , {
            new:true,
            runValidators:true
        })
        if(!response){
            return res.status(404).json({error : "Update failed"})
        }
        console.log("Post updated")
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Internal server error"})
    }
})


router.delete("/delete/:id", async (req, res) => {
    try {
        const postId = req.params.id;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);

        console.log("Post deleted successfully");
        res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});




router.post("/like/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Like or Unlike logic
        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((id) => id !== userId); // Unlike
        } else {
            post.likes.push(userId); // Like
        }

        await post.save();
        res.status(200).json({ message: "Like updated", likes: post.likes });

    } catch (error) {
        console.error("Error in like route:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

  

router.post('/comment/:id', async (req, res) => {
    try {
        const { userId, text } = req.body;

        if (!userId || !text) {
            return res.status(400).json({ error: "User ID and comment text are required" });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const newComment = { user: userId, text, createdAt: new Date() };
        post.comments.push(newComment);
        await post.save();

        res.status(200).json({ message: "Comment Added", comment: newComment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.delete('/comment/:postId/:commentId', async (req, res) => {
    try {
        const { userId } = req.body;
        const post = await Post.findById(req.params.postId);

        if (!post) return res.status(404).json({ error: "Post not found" });

        const comment = post.comments.find(c => c._id.toString() === req.params.commentId);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        if (comment.user.toString() !== userId) {
            return res.status(403).json({ error: "Unauthorized to delete this comment" });
        }

        post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
        await post.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router