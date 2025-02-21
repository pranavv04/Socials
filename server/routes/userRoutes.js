const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { jwtAuthMiddleware } = require("../jwt");

// Get all users
router.get("/", async (req, res) => {
  try {
    const data = await User.find();
    console.log("User data fetched");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a user by ID (with authentication)
router.get("/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId).populate("posts");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User data fetched");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a user by username
router.get("/profile/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const response = await User.findOne({ username });

    if (!response) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User data fetched");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user details
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedBody = req.body;

    const response = await User.findByIdAndUpdate(userId, updatedBody, {
      runValidators: true,
      new: true,
    });

    if (!response) {
      return res.status(404).json({ error: "Update failed" });
    }

    console.log("User data updated");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await User.findByIdAndDelete(userId);

    if (!response) {
      return res.status(404).json({ error: "User deletion failed" });
    }

    console.log("User profile deleted");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Follow a user
router.post("/follow/:id", async (req, res) => {
  try {
    console.log("Follow API called");
    const { currentUserId } = req.body;
    const { id: targetUserId } = req.params;

    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      console.log("User not found error - Debugging users:");
      console.log("currentUser:", currentUser);
      console.log("targetUser:", targetUser);
      return res.status(404).json({ error: "User not found" });
    }

    if (!currentUser.following.includes(targetUserId)) {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await currentUser.save();
      await targetUser.save();
      return res.status(200).json({ message: "User followed successfully" });
    } else {
      return res.status(400).json({ error: "You are already following this user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Unfollow a user
router.post("/unfollow/:id", async (req, res) => {
  try {
    const { currentUserId } = req.body;
    const { id: targetUserId } = req.params;

    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
