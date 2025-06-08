const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/mockAuth');
const NutritionScoreController = require('../controllers/nutritionScore');

/**
 * @route POST /api/nutrition/score/:foodId
 * @desc Calculate and save nutrition score for a food
 * @access Private
 */
router.post(
    '/score/:foodId',
    authenticate,
    NutritionScoreController.calculateAndSaveScore
);

/**
 * @route GET /api/nutrition/score/:foodId
 * @desc Get nutrition score for a food
 * @access Private
 */
router.get(
    '/score/:foodId',
    authenticate,
    NutritionScoreController.getScoreByFoodId
);

/**
 * @route GET /api/nutrition/score/:foodId/compare
 * @desc Compare nutrition score calculation methods for a food
 * @access Private
 */
router.get(
    '/score/:foodId/compare',
    authenticate,
    NutritionScoreController.compareScoreMethods
);

/**
 * @route GET /api/nutrition/scores
 * @desc Get all nutrition scores for a user
 * @access Private
 */
router.get(
    '/scores',
    authenticate,
    NutritionScoreController.getAllScores
);

/**
 * @route DELETE /api/nutrition/score/:scoreId
 * @desc Delete a nutrition score
 * @access Private
 */
router.delete(
    '/score/:scoreId',
    authenticate,
    NutritionScoreController.deleteScore
);

module.exports = router;
