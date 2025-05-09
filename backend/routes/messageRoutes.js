// routes/messageRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/messageControllers');
const router = express.Router();

router.route('/')
  .post(protect, sendMessage)   // send a message
  .get(protect, getMessages);   // fetch chat history

module.exports = router;
