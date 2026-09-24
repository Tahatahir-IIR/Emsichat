const mongoose = require("mongoose");

// Message sub-schema to embed inside Group
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: false,
  },
  fileUrl: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  messageType: {
    type: String,
    enum: ["text", "file", "voice"],
    default: "text",
  },
});

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // Image path
  image: { type: String }, // ✅ ADD THIS LINE

  // Admin/creator of the group
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  inviteLink: { type: String, unique: true },
  // Members (including admin)
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  // Add messages array here (embedded documents)
  messages: [messageSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Group", groupSchema);
