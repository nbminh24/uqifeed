const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/mockAuth');
const FoodController = require('../controllers/food');

/**
 * @route GET /api/foods/:id/detailed
 * @desc Get detailed food information including related data like comments and scores
 * @access Private
 */
router.get('/:id/detailed', authenticate, FoodController.getFoodWithDetails);


router.post(
    '/analyze-and-save',
    authenticate,
    FoodController.analyzeAndSaveFood
);

/**
 * @route GET /api/foods
 * @desc Get user's foods with optional filtering by meal type
 * @access Private
 */
router.get(
    '/',
    authenticate,
    FoodController.getUserFoods
);

/**
 * @route GET /api/foods/:id
 * @desc Get food by ID with ingredients
 * @access Private
 */
router.get(
    '/:id',
    authenticate,
    FoodController.getFoodById
);

/**
 * @route PUT /api/foods/:id
 * @desc Update food
 * @access Private
 */
router.put(
    '/:id',
    authenticate,
    FoodController.updateFood
);

/**
 * @route DELETE /api/foods/:id
 * @desc Delete food and its ingredients
 * @access Private
 */
router.delete(
    '/:id',
    authenticate,
    FoodController.deleteFood
);

/**
 * @route POST /api/foods/:id/calculate-nutrition
 * @desc Calculate nutrition values for food from its ingredients
 * @access Private
 */
router.post(
    '/:id/calculate-nutrition',
    authenticate,
    FoodController.calculateNutrition
);

module.exports = router;
