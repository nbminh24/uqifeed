/**
 * Mock Authentication Middleware for Testing
 * This middleware bypasses authentication and sets a mock user for testing purposes.
 */
const TargetNutrition = require('../models/targetNutrition');

exports.authenticate = async (req, res, next) => {
    try {
        // Set a mock user for testing - using real admin user ID
        req.user = {
            id: 'nR3t7mJhxhIdQvTqSIqX',
            email: 'admin@gmail.com',
            username: 'admin',
            role: 'admin',
            createdAt: '2025-05-23T05:51:57.402Z',
            updatedAt: '2025-05-23T05:51:57.402Z'
        };

        // Continue to the next middleware
        next();
    } catch (error) {
        console.error('Error in mock authentication middleware:', error);
        next();
    }
};

/**
 * Mock Role Authorization Middleware for Testing
 * This middleware bypasses role authorization for testing purposes.
 */
exports.authorize = (roles) => {
    return (req, res, next) => {
        // Always authorize the request
        next();
    };
};
