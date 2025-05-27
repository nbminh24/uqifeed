const express = require('express');
const router = express.Router();
// Sử dụng mock authentication cho testing
const { authenticate } = require('../middleware/mockAuth');
const { uploadImage } = require('../middleware/upload');
const OneStopAnalysisController = require('../controllers/oneStopAnalysis');

/**
 * @route POST /api/one-stop-analysis
 * @desc Process complete food analysis pipeline from image to nutritional insights
 * @access Private
 */
router.post(
    '/',
    authenticate, // Sử dụng mock authentication
    OneStopAnalysisController.processFullAnalysis
);

/**
 * @route POST /api/one-stop-analysis/upload
 * @desc Process complete food analysis pipeline from uploaded image file
 * @access Private
 */
router.post(
    '/upload',
    authenticate,
    uploadImage,
    OneStopAnalysisController.processFullAnalysisFromUpload
);

module.exports = router;
