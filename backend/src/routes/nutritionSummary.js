const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/mockAuth');
const nutritionSummaryController = require('../controllers/nutritionSummary');

router.get('/', authenticate, nutritionSummaryController.getDailySummary);

module.exports = router;