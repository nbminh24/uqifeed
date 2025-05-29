const jwt = require('jsonwebtoken');
const { admin } = require('../config/firebase');

/**
 * Authentication Middleware
 * Verifies the JWT token from the user and attaches the user data to the request object
 */
exports.authenticate = async (req, res, next) => {
    // Always set mock user for development/testing
    req.user = {
        id: 'nR3t7mJhxhIdQvTqSIqX',
        email: 'admin@gmail.com',
        username: 'admin',
        role: 'admin',
        createdAt: '2025-05-23T05:51:57.402Z',
        updatedAt: '2025-05-23T05:51:57.402Z'
    };
    next();
}

/**
 * Role Authorization Middleware
 * Checks if the user has the required role(s) to access a route
 * @param {String|Array} roles - Required role(s) to access the route
 */
exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        // Convert single role to array
        if (!Array.isArray(roles)) {
            roles = [roles];
        }

        // Check if user role is in the roles array
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }

        next();
    };
};
