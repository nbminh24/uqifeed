const Food = require('../models/food');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');

exports.getFoodsByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return sendErrorResponse(res, 'Start date and end date are required', 400);
        }

        const userId = req.user ? req.user.id : 'nR3t7mJhxhIdQvTqSIqX'; // Support mock token for testing

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return sendErrorResponse(res, 'Invalid date format', 400);
        }

        // Get foods for date range
        const foods = await Food.findByDateRange(
            userId,
            start.toISOString().split('T')[0], // Just use the date part
            end.toISOString().split('T')[0]
        );

        // Group foods by date
        const foodsByDate = foods.reduce((acc, food) => {
            const dateKey = food.created_at.split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push({
                id: food.id,
                name: food.food_name,
                calories: food.total_calorie || 0,
                nutritionScore: 0, // Will need to get this from another collection if needed
                mealTime: food.created_at,
                imageUrl: food.food_image
            });
            return acc;
        }, {});

        return sendSuccessResponse(res, 'Foods retrieved successfully', { foodsByDate });
    } catch (error) {
        console.error('Error getting foods by date:', error);
        return sendErrorResponse(res, 'Failed to retrieve food history', 500);
    }
};
