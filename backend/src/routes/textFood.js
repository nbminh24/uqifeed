/**
 * Router for text-based food operations
 */

const express = require('express');
const router = express.Router();
const TextFoodController = require('../controllers/textFoodController');
const { authenticateToken } = require('../middleware/auth');

// Create food from text analysis
router.post('/create', authenticateToken, TextFoodController.createFood);

// Update food from text analysis
router.put('/:foodId', authenticateToken, TextFoodController.updateFood);

module.exports = router;
