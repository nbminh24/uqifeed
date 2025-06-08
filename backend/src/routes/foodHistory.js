const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/mockAuth');
const { getFoodsByDate } = require('../controllers/foodHistory');

router.get('/', authenticate, getFoodsByDate);

module.exports = router;
