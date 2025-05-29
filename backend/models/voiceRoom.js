const mongoose = require("mongoose");

const voiceRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("VoiceRoom", voiceRoomSchema);
