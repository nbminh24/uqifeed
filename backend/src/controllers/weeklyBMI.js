const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');
const WeeklyBMI = require('../models/weeklyBMI');
const { startOfWeek, endOfWeek, format } = require('date-fns');

/**
 * Weekly BMI Controller
 * Handles operations related to weekly BMI tracking
 */
const WeeklyBMIController = {
    /**
     * Create or update weekly BMI record
     * @route POST /api/weekly-bmi
     * @access Private
     */
    updateWeeklyBMI: async (req, res) => {
        try {
            const { weight, height, weekStart: inputWeekStart } = req.body;
            const userId = req.user ? req.user.id : 'nR3t7mJhxhIdQvTqSIqX'; // Temporary default user ID

            if (!weight || !height) {
                return sendErrorResponse(res, 'Weight and height are required', 400);
            }

            // Calculate week start date - use input weekStart if provided, otherwise use current week
            let weekStart;
            if (inputWeekStart) {
                weekStart = startOfWeek(new Date(inputWeekStart), { weekStartsOn: 1 }); // Start on Monday
            } else {
                weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start on Monday
            }
            const formattedWeekStart = format(weekStart, 'yyyy-MM-dd');

            // Calculate BMI
            const bmi = WeeklyBMI.calculateBMI(weight, height);
            const bmiCategory = WeeklyBMI.getBMICategory(bmi);

            // Prepare data for storage
            const bmiData = {
                userId,
                weekStart: formattedWeekStart,
                weight,
                height,
                bmi: Math.round(bmi * 10) / 10, // Round to 1 decimal place
                category: bmiCategory.category,
                description: bmiCategory.description
            };            // Store BMI data in both collections
            const bmiResult = await WeeklyBMI.createOrUpdate(bmiData);

            // Also update weekly report with new BMI data
            const WeeklyReport = require('./weeklyReport');
            const report = new WeeklyReport({
                userId,
                weekStart: formattedWeekStart,
                weekEnd: format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
                bmi: bmiData.bmi,
                height: bmiData.height,
                weight: bmiData.weight
            });
            await report.save();

            return sendSuccessResponse(res, 'Weekly BMI updated successfully', bmiResult);
        } catch (error) {
            console.error('Error in updateWeeklyBMI:', error);
            return sendErrorResponse(res, 'Failed to update weekly BMI', 500);
        }
    },

    /**
     * Get weekly BMI for current week
     * @route GET /api/weekly-bmi/current
     * @access Private
     */
    getCurrentWeekBMI: async (req, res) => {
        try {
            const userId = req.user ? req.user.id : 'nR3t7mJhxhIdQvTqSIqX'; // Temporary default user ID

            // Get current week's start date
            const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

            // Get BMI data
            const bmiData = await WeeklyBMI.findByUserIdAndWeek(userId, weekStart);

            if (!bmiData) {
                return sendSuccessResponse(res, 'No BMI data found for current week', null);
            }

            return sendSuccessResponse(res, 'Current week BMI retrieved successfully', bmiData);
        } catch (error) {
            console.error('Error in getCurrentWeekBMI:', error);
            return sendErrorResponse(res, 'Failed to get current week BMI', 500);
        }
    },

    /**
     * Get BMI history for a date range
     * @route GET /api/weekly-bmi/history
     * @access Private
     */
    getBMIHistory: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const userId = req.user ? req.user.id : 'nR3t7mJhxhIdQvTqSIqX'; // Temporary default user ID

            if (!startDate || !endDate) {
                return sendErrorResponse(res, 'Start date and end date are required', 400);
            }            // Parse and validate dates
            const parsedStartDate = new Date(startDate);
            const parsedEndDate = new Date(endDate);

            if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
                return sendErrorResponse(res, 'Invalid date format. Please use YYYY-MM-DD format', 400);
            }

            if (parsedEndDate < parsedStartDate) {
                return sendErrorResponse(res, 'End date must be after start date', 400);
            }

            // Format dates
            const formattedStartDate = format(parsedStartDate, 'yyyy-MM-dd');
            const formattedEndDate = format(parsedEndDate, 'yyyy-MM-dd');

            // Get BMI history
            const bmiHistory = await WeeklyBMI.findByUserIdAndDateRange(
                userId,
                formattedStartDate,
                formattedEndDate
            );

            return sendSuccessResponse(res, 'BMI history retrieved successfully', bmiHistory);
        } catch (error) {
            console.error('Error in getBMIHistory:', error);
            return sendErrorResponse(res, 'Failed to get BMI history', 500);
        }
    }
};

module.exports = WeeklyBMIController;
