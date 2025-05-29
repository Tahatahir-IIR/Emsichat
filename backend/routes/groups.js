const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Group = require("../models/group");
const User = require("../models/user");  // Import User model

router.get("/:groupId", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("messages.sender", "username")  // populate sender usernames if messages have sender ref
      .populate("members", "username _id");     // optionally populate members

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:groupId/message", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { sender, text, fileUrl, messageType } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Add message to group's messages array
    group.messages.push({
      sender,
      text,
      fileUrl,
      messageType,
      timestamp: new Date(),
    });

    await group.save();

    res.status(201).json({ message: "Message added successfully", messages: group.messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/groups/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("servers");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user.servers);
  } catch (err) {
    console.error("Error fetching user's servers:", err);
    res.status(500).json({ error: "Failed to fetch servers" });
  }
});


// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 12345.png
  }
});

const upload = multer({ storage });



// POST /api/groups/create
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, creatorId } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    const generateInviteLink = () => {
      return Math.random().toString(36).substring(2, 10); // 8-char random string
    };

    // Create new group
    const newGroup = new Group({
      name,
      admin: creatorId,
      members: [creatorId],
      image: imagePath,
      inviteLink: generateInviteLink(),
    });

    await newGroup.save();

    // Add the new group's id to the creator user's servers array
    const user = await User.findById(creatorId);
    if (!user) {
      return res.status(404).json({ error: "Creator user not found" });
    }

    user.servers.push(newGroup._id);
    await user.save();

    res.status(201).json(newGroup);
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ error: "Failed to create group" });
  }
});

router.get("/:groupId/members", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("members", "username _id");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group.members);
  } catch (error) {
    console.error("Error fetching group members:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/join", async (req, res) => {
  const { inviteLink, userId } = req.body;

  if (!inviteLink || !userId) {
    return res.status(400).json({ message: "Missing inviteLink or userId" });
  }

  try {
    const group = await Group.findOne({ inviteLink });
    if (!group) {
      return res.status(404).json({ message: "Group not found with this invite link" });
    }

    if (group.members && group.members.includes(userId)) {
      return res.status(400).json({ message: "User already a member of this group" });
    }

    group.members = group.members || [];
    group.members.push(userId);
    await group.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.servers = user.servers || [];

    if (!user.servers.includes(group._id)) {
      user.servers.push(group._id);
      await user.save();
    }

    return res.status(200).json({ message: "Joined the group successfully", groupId: group._id });
  } catch (error) {
    console.error("Error joining group:", error.message);
    console.error(error.stack);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
