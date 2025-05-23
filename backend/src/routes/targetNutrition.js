const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const targetNutritionController = require('../controllers/targetNutrition');

// Routes
router.post(
    '/calculate',
    authenticate,
    targetNutritionController.calculateNutrition
);

router.get(
    '/me',
    authenticate,
    targetNutritionController.getNutrition
);

router.put(
    '/recalculate',
    authenticate,
    targetNutritionController.recalculateNutrition
);

router.get(
    '/:id',
    authenticate,
    targetNutritionController.getNutritionById
);

module.exports = router;
