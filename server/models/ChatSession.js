const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  username: { type: String },
  member: { type: String },
  createdAt: { type: Date, default: Date.now },
  messages: [MessageSchema],
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema, 'chats');
