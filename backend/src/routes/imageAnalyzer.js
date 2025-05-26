const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const imageAnalyzerController = require('../controllers/imageAnalyzer');

// Routes for food image analysis
router.post(
    '/analyze-food',
    authenticate,
    imageAnalyzerController.analyzeFoodImage
);

router.post(
    '/analyze-food-only',
    authenticate,
    imageAnalyzerController.analyzeFoodImageOnly
);

router.post(
    '/analyze-complete',
    authenticate,
    imageAnalyzerController.analyzeComplete
);

module.exports = router;
