const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const chatbotController = require('../controllers/chatbot');

/**
 * @route POST /api/chatbot/chat
 * @desc Get response from the nutrition chatbot
 * @access Private
 */
router.post('/chat', authenticate, chatbotController.chat.bind(chatbotController));

module.exports = router;
