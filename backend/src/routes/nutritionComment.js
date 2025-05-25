/**
 * Nutrition Comment Routes
 * Routes for nutrition comment-related requests
 */
const express = require('express');
const router = express.Router();
const nutritionCommentController = require('../controllers/nutritionCommentController');

// Get all nutrition comments for a specific nutrition post
router.get('/:nutritionId', nutritionCommentController.getCommentsByNutritionId);

// Create a new nutrition comment
router.post('/', nutritionCommentController.createComment);

// Update a nutrition comment
router.put('/:id', nutritionCommentController.updateComment);

// Delete a nutrition comment
router.delete('/:id', nutritionCommentController.deleteComment);

module.exports = router;
