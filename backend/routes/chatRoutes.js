// routes/chatRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChat, acceptChat, fetchAdminChats } = require('../controllers/chatControllers');
const router = express.Router();

router.route('/')
  .post(protect, accessChat);        // customer starts chat
router.route('/accept')
  .put(protect, acceptChat);         // admin accepts
router.route('/admin')
  .get(protect, fetchAdminChats);    // admin fetches chats

module.exports = router;
