const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const multer = require('multer');
const path = require('path');

// Configure multer storage and file naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists and is served statically
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

// Get chat between two users
router.get("/find/:userId1/:userId2", async (req, res) => {
  const { userId1, userId2 } = req.params;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId1, userId2] },
    }).populate("messages.sender", "username");

    if (!chat) {
      chat = new Chat({ participants: [userId1, userId2], messages: [] });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message (text or other types except file)
router.post("/send", async (req, res) => {
  const { senderId, receiverId, text, messageType = "text", fileUrl } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: "senderId and receiverId are required" });
  }

  try {
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = new Chat({ participants: [senderId, receiverId], messages: [] });
    }

    const message = {
      sender: senderId,
      text,
      messageType,
      fileUrl,
      timestamp: new Date(),  // add timestamp for all messages
    };

    chat.messages.push(message);
    await chat.save();

    // populate sender username in the saved message for response if needed
    await chat.populate("messages.sender", "username");

    res.status(201).json({ chat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a file
router.post('/send-file', upload.single('file'), async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: "senderId and receiverId are required" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = new Chat({ participants: [senderId, receiverId], messages: [] });
    }

    const message = {
      sender: senderId,
      fileUrl,
      messageType: 'file',
      timestamp: new Date(),
    };

    chat.messages.push(message);
    await chat.save();

    await chat.populate("messages.sender", "username");

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
