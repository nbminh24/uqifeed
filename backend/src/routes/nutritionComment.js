/**
 * Nutrition Comment Routes
 * Routes for nutrition comment-related requests
 */
const express = require('express');
const router = express.Router();
const nutritionCommentController = require('../controllers/nutritionComment');
const auth = require('../middleware/auth');

// Generate and store nutrition comments for a food
router.post('/generate/:foodId/:targetNutritionId', auth, nutritionCommentController.generateComments);

// Get nutrition comments for a food
router.get('/food/:foodId', auth, nutritionCommentController.getCommentsByFood);

// Get nutrition comment by ID
router.get('/:commentId', auth, nutritionCommentController.getCommentById);

// Update a nutrition comment
router.put('/:commentId', auth, nutritionCommentController.updateComment);

// Delete a nutrition comment
router.delete('/:commentId', auth, nutritionCommentController.deleteComment);

// Delete all nutrition comments for a food
router.delete('/food/:foodId', auth, nutritionCommentController.deleteCommentsByFood);

module.exports = router;
