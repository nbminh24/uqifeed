/**
 * Mock Authentication Middleware
 * This middleware bypasses authentication and sets the default system user for all requests
 */
const MOCK_USER = require('../config/mockUser');

exports.authenticate = async (req, res, next) => {
    try {
        // Always set the default system user
        req.user = MOCK_USER;
        next();
    } catch (error) {
        console.error('Error in mock authentication middleware:', error);
        next(error);
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
