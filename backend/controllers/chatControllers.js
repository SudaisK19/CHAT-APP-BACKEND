const mongoose     = require('mongoose');
const asyncHandler = require('express-async-handler');
const Chat         = require('../models/chatModel');
const Message      = require('../models/messageModel');

// Customer starts (or returns) a waiting chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID required' });

  const meId    = mongoose.Types.ObjectId(req.user._id);
  const otherId = mongoose.Types.ObjectId(userId);

  let chat = await Chat.findOne({
    isGroupChat: false,
    users:       { $all: [meId, otherId] }
  }).populate('users', '-password');

  if (!chat) {
    chat = await Chat.create({
      users:  [meId, otherId],
      status: 'waiting'
    });

    await Message.create({
      chat:      chat._id,
      sender:    otherId,   // automated “seller” message
      content:   "👋 Thanks for reaching out! A seller will be with you shortly.",
      timestamp: Date.now()
    });

    chat = await Chat.findById(chat._id).populate('users', '-password');
  }

  return res.json(chat);
});

// Admin accepts a chat
const acceptChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const updated = await Chat.findByIdAndUpdate(
    chatId,
    { status: 'active', assignedAdmin: req.user._id },
    { new: true }
  ).populate('users', '-password');
  if (!updated) return res.status(404).send('Chat not found');
  res.json(updated);
});

// Admin fetches both waiting and active chats
const fetchAdminChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    $or: [
      { assignedAdmin: req.user._id },
      { status: 'waiting' }
    ]
  })
    .populate('users', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });

  res.json(chats);
});

// ← New: delete a chat (and its messages)
const deleteChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) {
    return res.status(404).json({ error: 'Chat not found' });
  }
  // remove all messages in that chat
  await Message.deleteMany({ chat: req.params.id });
  // remove the chat itself
  await chat.remove();
  res.json({ success: true });
});

module.exports = { accessChat, acceptChat, fetchAdminChats, deleteChat };
