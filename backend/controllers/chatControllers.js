// controllers/chatControllers.js
const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');

// Customer starts (or returns) a waiting chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).send('User ID required');

  let chat = await Chat.find({
    isGroupChat: false,
    status:      'waiting',
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } }
    ]
  }).populate('users', '-password');

  if (chat.length) return res.status(200).json(chat[0]);

  const created = await Chat.create({
    users:   [req.user._id, userId],
    status:  'waiting',
  });

  const fullChat = await Chat.findById(created._id).populate('users', '-password');
  res.status(201).json(fullChat);
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

// Admin fetches all their active chats
const fetchAdminChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ assignedAdmin: req.user._id })
    .populate('users', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });
  res.json(chats);
});

module.exports = { accessChat, acceptChat, fetchAdminChats };
