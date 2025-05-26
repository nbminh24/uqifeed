const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const textFoodAnalyzerController = require('../controllers/textFoodAnalyzer');

/**
 * @route POST /api/text-analysis/analyze-food
 * @desc Analyze food from text description with Gemini AI
 * @access Private
 */
router.post(
    '/analyze-food',
    authenticate,
    textFoodAnalyzerController.analyzeFoodText
);

/**
 * @route POST /api/text-analysis/analyze-and-save
 * @desc Analyze food from text with Gemini AI and save food data
 * @access Private
 */
router.post(
    '/analyze-and-save',
    authenticate,
    textFoodAnalyzerController.analyzeAndSaveFood
);

/**
 * @route POST /api/text-analysis/analyze-complete
 * @desc Analyze food text and calculate nutrition values, score, and comments without saving
 * @access Private
 */
router.post(
    '/analyze-complete',
    authenticate,
    textFoodAnalyzerController.analyzeComplete
);

module.exports = router;
