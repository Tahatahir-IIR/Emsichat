const express = require("express");
const router = express.Router();
const VoiceRoom = require("../models/voiceRoom");

// Create voice room
router.post("/", async (req, res) => {
  const { groupId, name } = req.body;

  if (!groupId || !name) {
    return res.status(400).json({ message: "groupId and name are required" });
  }

  try {
    const newRoom = new VoiceRoom({ groupId, name });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error creating voice room:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all voice rooms for a group
router.get("/:groupId", async (req, res) => {
  try {
    const rooms = await VoiceRoom.find({ groupId: req.params.groupId });
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching voice rooms:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
