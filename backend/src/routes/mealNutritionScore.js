const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/mockAuth');
const MealNutritionScoreController = require('../controllers/mealNutritionScore');

/**
 * @route POST /api/nutrition/meal-score
 * @desc Calculate nutrition score for a meal (multiple foods)
 * @access Private
 */
router.post(
    '/meal-score',
    authenticate,
    MealNutritionScoreController.calculateMealScore
);

/**
 * @route GET /api/nutrition/food-record-score/:recordId
 * @desc Calculate nutrition score for a food record
 * @access Private
 */
router.get(
    '/food-record-score/:recordId',
    authenticate,
    MealNutritionScoreController.calculateFoodRecordScore
);

module.exports = router;
