const express = require('express');
const router = express.Router();

// Controllers
const indexController = require('../controllers/index');

// Import other routes
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const targetNutritionRoutes = require('./targetNutrition');
const mealTypeRoutes = require('./mealType');

// Base routes
router.get('/', indexController.home);
router.get('/api/health', indexController.healthCheck);

// Use route modules
router.use('/api/auth', authRoutes);
router.use('/api/profiles', profileRoutes);
router.use('/api/nutrition', targetNutritionRoutes);
router.use('/api/meal-types', mealTypeRoutes);

module.exports = router;
