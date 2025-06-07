/**
 * Router for text-based food operations
 */

const express = require('express');
const router = express.Router();
const TextFoodController = require('../controllers/textFoodController');
const { authenticate } = require('../middleware/mockAuth');

// Create food from text analysis
router.post('/create', authenticate, TextFoodController.createFood);

// Update food from text analysis
router.put('/:foodId', authenticate, TextFoodController.updateFood);

module.exports = router;
