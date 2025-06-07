const jwt = require('jsonwebtoken');
const { admin } = require('../config/firebase');

// Mock user for development
const DEFAULT_USER = {
    id: 'nR3t7mJhxhIdQvTqSIqX', // Admin user ID
    role: 'admin'
};

/**
 * Authentication Middleware
 * Verifies the JWT token from the user and attaches the user data to the request object
 */
exports.authenticate = async (req, res, next) => {
    try {
        let token;

        // Get token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];

            // For development: accept default token
            if (token === 'default-auth-token-123') {
                req.user = DEFAULT_USER;
                return next();
            }
        }

        // No token found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Phiên đăng nhập đã hết hạn hoặc chưa đăng nhập'
            });
        }

        // For development, accept default token
        if (token === 'default-auth-token-123' && process.env.NODE_ENV !== 'production') {
            req.user = DEFAULT_USER;
            return next();
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user info to request
            req.user = {
                id: decoded.id,
                role: decoded.role
            };

            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({
                success: false,
                message: 'Phiên đăng nhập đã hết hạn'
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Phiên đăng nhập đã hết hạn'
        });
    }
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
