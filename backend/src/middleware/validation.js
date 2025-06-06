const { validationResult } = require('express-validator');

/**
 * Validation Middleware
 * Checks for validation errors from express-validator
 */
const validationMiddleware = (req, res, next) => {
    console.log('[Validation Middleware] Request body:', JSON.stringify(req.body, null, 2));
    console.log('[Validation Middleware] Target time:', req.body.target_time);
    console.log('[Validation Middleware] Target time type:', typeof req.body.target_time);

    const errors = validationResult(req); if (!errors.isEmpty()) {
        const errorArray = errors.array();
        console.log('[Validation Middleware] All validation errors:', JSON.stringify(errorArray, null, 2));
        return res.status(400).json({
            success: false,
            errors: [{ message: errorArray[0].msg }]
        });
    }

    next();
};

module.exports = validationMiddleware;
