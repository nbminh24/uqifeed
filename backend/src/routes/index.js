const express = require('express');
const router = express.Router();

// Controllers
const indexController = require('../controllers/index');

// Import other routes
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const targetNutritionRoutes = require('./targetNutrition');
const nutritionScoreRoutes = require('./nutritionScore');
const mealNutritionScoreRoutes = require('./mealNutritionScore');
const nutritionCommentRoutes = require('./nutritionComment');
const mealTypeRoutes = require('./mealType');
const imageRoutes = require('./image');
const imageAnalyzerRoutes = require('./imageAnalyzer');
const textFoodAnalyzerRoutes = require('./textFoodAnalyzer');
const textFoodRoutes = require('./textFood');
const foodRoutes = require('./food');
const oneStopAnalysisRoutes = require('./oneStopAnalysis');
const oneStopTextAnalysisRoutes = require('./oneStopTextAnalysis');

// Base routes
router.get('/', indexController.home);
router.get('/api/health', indexController.healthCheck);

// Use route modules
router.use('/api/auth', authRoutes);
router.use('/api/profiles', profileRoutes);
router.use('/api/nutrition', targetNutritionRoutes);
router.use('/api/nutrition', nutritionScoreRoutes);
router.use('/api/nutrition', mealNutritionScoreRoutes);
router.use('/api/nutrition/comments', nutritionCommentRoutes);
router.use('/api/meal-types', mealTypeRoutes);
router.use('/api/images', imageRoutes);
router.use('/api/food-analysis', imageAnalyzerRoutes);
router.use('/api/text-analysis', textFoodAnalyzerRoutes);
router.use('/api/text-food', textFoodRoutes);
router.use('/api/foods', foodRoutes);
router.use('/api/one-stop-analysis', oneStopAnalysisRoutes);
router.use('/api/one-stop-text-analysis', oneStopTextAnalysisRoutes);

module.exports = router;
