const MealType = require('../models/mealType');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');

/**
 * MealType Controller
 * Handles all meal type related operations
 */
const MealTypeController = {
    /**
     * Create a new meal type
     * @route POST /api/meal-types
     * @access Admin
     */
    createMealType: async (req, res) => {
        try {
            // Check if user is admin
            if (req.user.role !== 'admin') {
                return sendErrorResponse(
                    res,
                    'Not authorized to access this resource',
                    403
                );
            }

            const { name } = req.body;

            // Validate input
            if (!name) {
                return sendErrorResponse(
                    res,
                    'Meal type name is required',
                    400
                );
            }

            // Create meal type
            const mealType = await MealType.create({
                name
            });

            return sendSuccessResponse(
                res,
                'Meal type created successfully',
                { mealType },
                201
            );
        } catch (error) {
            console.error('Create meal type error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error creating meal type',
                500
            );
        }
    },

    /**
     * Get all meal types
     * @route GET /api/meal-types
     * @access Public
     */
    getAllMealTypes: async (req, res) => {
        try {
            const mealTypes = await MealType.findAll();

            return sendSuccessResponse(
                res,
                'Meal types retrieved successfully',
                { mealTypes }
            );
        } catch (error) {
            console.error('Get all meal types error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving meal types',
                500
            );
        }
    },

    /**
     * Get meal type by ID
     * @route GET /api/meal-types/:id
     * @access Public
     */
    getMealTypeById: async (req, res) => {
        try {
            const mealType = await MealType.findById(req.params.id);

            if (!mealType) {
                return sendErrorResponse(
                    res,
                    'Meal type not found',
                    404
                );
            }

            return sendSuccessResponse(
                res,
                'Meal type retrieved successfully',
                { mealType }
            );
        } catch (error) {
            console.error('Get meal type error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving meal type',
                500
            );
        }
    },

    /**
     * Update meal type
     * @route PUT /api/meal-types/:id
     * @access Admin
     */
    updateMealType: async (req, res) => {
        try {
            // Check if user is admin
            if (req.user.role !== 'admin') {
                return sendErrorResponse(
                    res,
                    'Not authorized to access this resource',
                    403
                );
            }

            const { name } = req.body;

            // Validate input
            if (!name) {
                return sendErrorResponse(
                    res,
                    'Meal type name is required',
                    400
                );
            }

            // Check if meal type exists
            const mealType = await MealType.findById(req.params.id);
            if (!mealType) {
                return sendErrorResponse(
                    res,
                    'Meal type not found',
                    404
                );
            }

            // Update meal type
            const updatedMealType = await MealType.update(req.params.id, {
                name
            });

            return sendSuccessResponse(
                res,
                'Meal type updated successfully',
                { mealType: updatedMealType }
            );
        } catch (error) {
            console.error('Update meal type error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error updating meal type',
                500
            );
        }
    },

    /**
     * Delete meal type
     * @route DELETE /api/meal-types/:id
     * @access Admin
     */
    deleteMealType: async (req, res) => {
        try {
            // Check if user is admin
            if (req.user.role !== 'admin') {
                return sendErrorResponse(
                    res,
                    'Not authorized to access this resource',
                    403
                );
            }

            // Check if meal type exists
            const mealType = await MealType.findById(req.params.id);
            if (!mealType) {
                return sendErrorResponse(
                    res,
                    'Meal type not found',
                    404
                );
            }

            // Delete meal type
            await MealType.delete(req.params.id);

            return sendSuccessResponse(
                res,
                'Meal type deleted successfully'
            );
        } catch (error) {
            console.error('Delete meal type error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error deleting meal type',
                500
            );
        }
    }
};

module.exports = MealTypeController;
