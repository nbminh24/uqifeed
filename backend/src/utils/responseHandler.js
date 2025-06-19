/**
 * Response utility
 * Provides consistent response formats across the API
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object|Array} data - Response data
 * @param {Number} statusCode - HTTP status code
 */
exports.sendSuccess = (res, message, data = null, statusCode = 200) => {
    const response = {
        success: true,
        message
    };

    if (data) {
        response.data = data;
    }

    res.status(statusCode).json(response);
};

/**
 * Send success response (alias for sendSuccess)
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object|Array} data - Response data
 * @param {Number} statusCode - HTTP status code
 */
exports.sendSuccessResponse = (res, message, data = null, statusCode = 200) => {
    this.sendSuccess(res, message, data, statusCode);
};

/**
 * Send created response
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object|Array} data - Response data
 */
exports.sendCreated = (res, message, data = null) => {
    this.sendSuccess(res, message, data, 201);
};

/**
 * Send no content response
 * @param {Object} res - Express response object
 */
exports.sendNoContent = (res) => {
    res.status(204).end();
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object|Array} data - Response data
 * @param {Object} pagination - Pagination information
 * @param {Number} statusCode - HTTP status code
 */
exports.sendPaginated = (res, message, data, pagination, statusCode = 200) => {
    const response = {
        success: true,
        message,
        data,
        pagination
    };

    res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code
 * @param {Object} errors - Validation errors
 */
exports.sendErrorResponse = (res, message, statusCode = 400, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code
 * @param {Object} errors - Optional error details
 */
exports.sendError = (res, message, statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    res.status(statusCode).json(response);
};
