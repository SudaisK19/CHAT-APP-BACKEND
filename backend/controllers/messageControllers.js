// controllers/messageControllers.js
const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const Chat    = require('../models/chatModel');

// Send a new message
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  if (!chatId || !content) return res.status(400).send('chatId and content required');

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).send('Chat not found');

  const message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId
  });

  chat.latestMessage = message._id;
  await chat.save();

  res.status(201).json(message);
});

// Get all messages for a chat
const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.query;
  if (!chatId) return res.status(400).send('chatId required');

  const messages = await Message.find({ chat: chatId })
    .populate('sender', 'name email role')
    .sort({ createdAt: 1 });

  res.json(messages);
});

module.exports = { sendMessage, getMessages };
