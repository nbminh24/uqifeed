const express = require('express');
const router = express.Router();
// Sử dụng mock authentication cho testing
const { authenticate } = require('../middleware/mockAuth');
const OneStopTextAnalysisController = require('../controllers/oneStopTextAnalysis');

/**
 * @route POST /api/one-stop-text-analysis
 * @desc Process complete food analysis pipeline from text description to nutritional insights
 * @access Private
 */
router.post(
    '/',
    authenticate, // Sử dụng mock authentication
    OneStopTextAnalysisController.processFullTextAnalysis
);

module.exports = router;
