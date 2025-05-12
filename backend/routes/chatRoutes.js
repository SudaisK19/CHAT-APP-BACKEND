const express       = require('express');
const { protect }   = require('../middleware/authMiddleware');
const {
  accessChat,
  acceptChat,
  fetchAdminChats,
  deleteChat      // ← import the new handler
} = require('../controllers/chatControllers');
const router = express.Router();

router.route('/')
  .post(protect, accessChat);        // customer starts chat

router.route('/accept')
  .put(protect, acceptChat);         // admin accepts chat

router.route('/admin')
  .get(protect, fetchAdminChats);    // admin fetches chats

// ← New DELETE endpoint:
router.route('/:id')
  .delete(protect, deleteChat);

module.exports = router;
