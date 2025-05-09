// models/chatModel.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  chatName:      { type: String, default: 'Private Chat' },
  isGroupChat:   { type: Boolean, default: false },
  users:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status:        { type: String, default: 'waiting' }, // 'waiting' or 'active'
}, {
  timestamps: true,
});

module.exports = mongoose.model('Chat', chatSchema);
