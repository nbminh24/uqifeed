/**
 * Router for text recognition endpoints
 */

const express = require('express');
const router = express.Router();
const TextRecognitionController = require('../controllers/textRecognitionController');
const { authenticate } = require('../middleware/mockAuth');

// Analyze text description without saving
router.post('/analyze', authenticateToken, TextRecognitionController.analyzeText);

module.exports = router;
