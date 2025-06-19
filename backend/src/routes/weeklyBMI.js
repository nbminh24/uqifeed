const express = require('express');
const router = express.Router();
const {
    updateWeeklyBMI,
    getCurrentWeekBMI,
    getBMIHistory
} = require('../controllers/weeklyBMI');

// Update weekly BMI
router.post('/', updateWeeklyBMI);

// Get current week's BMI
router.get('/current', getCurrentWeekBMI);

// Get BMI history
router.get('/history', getBMIHistory);

module.exports = router;
