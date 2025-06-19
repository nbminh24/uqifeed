const express = require('express');
const WeeklyReportController = require('../controllers/weeklyReport');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get weekly reports by date range
router.get('/range', authenticate, WeeklyReportController.getByDateRange);

// Get most recent weekly report
router.get('/recent', authenticate, WeeklyReportController.getMostRecent);

module.exports = router;
