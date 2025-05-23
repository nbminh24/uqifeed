const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const mealTypeController = require('../controllers/mealType');
const { body } = require('express-validator');
const validationMiddleware = require('../middleware/validation');

// Validation rules
const mealTypeValidation = [
    body('name')
        .notEmpty().withMessage('Meal type name is required')
        .isIn(['Breakfast', 'Lunch', 'Dinner', 'Snacks']).withMessage('Meal type must be Breakfast, Lunch, Dinner, or Snacks')
];

// Routes
router.post(
    '/',
    authenticate,
    mealTypeValidation,
    validationMiddleware,
    mealTypeController.createMealType
);

router.get(
    '/',
    mealTypeController.getAllMealTypes
);

router.get(
    '/:id',
    mealTypeController.getMealTypeById
);

router.put(
    '/:id',
    authenticate,
    mealTypeValidation,
    validationMiddleware,
    mealTypeController.updateMealType
);

router.delete(
    '/:id',
    authenticate,
    mealTypeController.deleteMealType
);

module.exports = router;
