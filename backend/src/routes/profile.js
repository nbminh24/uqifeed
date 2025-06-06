const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const profileController = require('../controllers/profile');
const { body } = require('express-validator');
const validationMiddleware = require('../middleware/validation');

// Validation rules
const profileValidation = [
    body('gender').isIn(['Male', 'Female']).withMessage('Gender must be either Male or Female'),
    body('birthday').isISO8601().withMessage('Birthday must be a valid date'),
    body('height').isFloat({ min: 50, max: 250 }).withMessage('Height must be between 50 and 250 cm'),
    body('currentWeight').isFloat({ min: 20, max: 500 }).withMessage('Current weight must be between 20 and 500 kg'),
    body('targetWeight').isFloat({ min: 20, max: 500 }).withMessage('Target weight must be between 20 and 500 kg'), body('target_time')
        .exists().withMessage('Target time is required')
        .isISO8601().withMessage('Target time must be a valid date')
        .custom((value) => {
            const targetDate = new Date(value);
            if (isNaN(targetDate.getTime())) {
                throw new Error('Target time must be a valid date');
            }
            const currentDate = new Date();
            if (targetDate <= currentDate) {
                throw new Error('Target date must be in the future');
            }
            return true;
        }),
    body('activityLevel').isIn([
        'Sedentary',
        'Lightly active',
        'Moderately active',
        'Very active',
        'Extra active'
    ]).withMessage('Invalid activity level'),
    body('goal').isIn([
        'Lose weight',
        'Maintain weight',
        'Gain weight'
    ]).withMessage('Invalid goal'),
    body('dietType').isIn(['Balanced',
        'Vegetarian',
        'Vegan',
        'Low-carb',
        'Keto'
    ]).withMessage('Invalid diet type')
];

// Routes
router.post(
    '/',
    authenticate,
    profileValidation,
    validationMiddleware,
    profileController.createProfile
);

router.get(
    '/me',
    authenticate,
    profileController.getProfile
);

router.put(
    '/me',
    authenticate,
    profileValidation,
    validationMiddleware,
    profileController.updateProfile
);

router.get(
    '/:id',
    authenticate,
    profileController.getProfileById
);

router.get(
    '/',
    authenticate,
    profileController.getAllProfiles
);

module.exports = router;
