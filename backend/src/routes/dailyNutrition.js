const express = require('express');
const router = express.Router();
const {
    getDailyNutrition,
    updateDailyNutrition,
    getDailyNutritionRange
} = require('../controllers/dailyNutrition');

// Get daily nutrition for a specific date
router.get('/', getDailyNutrition);

// Get daily nutrition for a date range
router.get('/range', getDailyNutritionRange);

// Update daily nutrition for a specific date
router.post('/update', updateDailyNutrition);

module.exports = router;
