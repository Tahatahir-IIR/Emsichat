const mongoose = require('mongoose');

// Define a message schema (embedded inside Chat)
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    enum: ['text', 'file', 'voice'],
    default: 'text'
  }
});

// Define the main Chat schema
const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: String,
    fileUrl: String,
    timestamp: { type: Date, default: Date.now },
    messageType: { type: String, enum: ['text', 'file', 'voice'], default: 'text' }
  }]
}, { timestamps: true });


module.exports = mongoose.model('Chat', chatSchema);
