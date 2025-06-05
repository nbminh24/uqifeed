const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');
const Food = require('../models/food');
const TargetNutrition = require('../models/targetNutrition');

/**
 * Nutrition Summary Controller
 * Handles operations related to daily nutrition summaries
 */
const NutritionSummaryController = {
    /**
     * Get daily nutrition summary
     * @route GET /api/nutrition-summary
     * @access Private
     */
    getDailySummary: async (req, res) => {
        try {
            const { date } = req.query;

            if (!date) {
                return sendErrorResponse(res, 'Date parameter is required', 400);
            }

            // Format dates for comparison
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            // Fetch all foods for this date
            const foods = await Food.findByDateRange({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                userId: req.user ? req.user.id : 'nR3t7mJhxhIdQvTqSIqX'
            });

            // Calculate total nutrition values
            const totals = {
                total_calories: 0,
                total_protein: 0,
                total_carbs: 0,
                total_fat: 0,
                total_fiber: 0,
            };

            foods.forEach(food => {
                totals.total_calories += food.total_calorie || 0;
                totals.total_protein += food.total_protein || 0;
                totals.total_carbs += food.total_carb || 0;
                totals.total_fat += food.total_fat || 0;
                totals.total_fiber += food.total_fiber || 0;
            });

            // Round all values to 2 decimal places
            for (const key in totals) {
                totals[key] = Math.round(totals[key] * 100) / 100;
            }

            return sendSuccessResponse(
                res,
                'Daily nutrition summary retrieved successfully',
                totals
            );

        } catch (error) {
            console.error('Error getting nutrition summary:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving nutrition summary',
                500
            );
        }
    }
};

module.exports = NutritionSummaryController;