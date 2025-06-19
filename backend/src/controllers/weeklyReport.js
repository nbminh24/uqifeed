const { sendSuccess: sendSuccessResponse, sendError: sendErrorResponse } = require('../utils/responseHandler');
const WeeklyReport = require('../models/weeklyReport');
const { startOfWeek, endOfWeek, format } = require('date-fns');

/**
 * Weekly Report Controller
 * Handles CRUD operations for weekly nutrition reports
 */
const WeeklyReportController = {
    /**
     * Create or update weekly report
     */
    async createOrUpdate(req, res) {
        try {
            const { weekStart, bmi, height, weight, avgNutrition, analysis, score } = req.body;
            const userId = req.user ? req.user.id : 'nR3t7mJhxhIdQvTqSIqX'; // Temporary default user ID

            // Calculate week start/end dates
            const weekStartDate = weekStart ? new Date(weekStart) : new Date();
            const startDate = startOfWeek(weekStartDate, { weekStartsOn: 1 });
            const endDate = endOfWeek(weekStartDate, { weekStartsOn: 1 });

            // Create report object
            const report = new WeeklyReport({
                userId,
                weekStart: format(startDate, 'yyyy-MM-dd'),
                weekEnd: format(endDate, 'yyyy-MM-dd'),
                bmi,
                height,
                weight,
                avgNutrition,
                analysis,
                score
            });

            // Save report
            await report.save();

            return sendSuccessResponse(res, 'Weekly report saved successfully', report);
        } catch (error) {
            console.error('Error in createOrUpdate:', error);
            return sendErrorResponse(res, 'Failed to save weekly report', 500);
        }
    },

    /**
     * Get weekly report by date range
     */
    getByDateRange: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const userId = req.user ? req.user.id : 'nR3t7mJhxhIdQvTqSIqX'; // Temporary default user ID

            if (!startDate || !endDate) {
                return sendErrorResponse(res, 'Start date and end date are required', 400);
            }

            // Format dates to YYYY-MM-DD
            const formattedStartDate = format(new Date(startDate), 'yyyy-MM-dd');
            const formattedEndDate = format(new Date(endDate), 'yyyy-MM-dd');

            // Get reports for date range
            const reports = await WeeklyReport.getByDateRange(userId, formattedStartDate, formattedEndDate);

            return sendSuccessResponse(res, 'Weekly reports retrieved successfully', reports);
        } catch (error) {
            console.error('Error in getByDateRange:', error);
            return sendErrorResponse(res, 'Failed to get weekly reports', 500);
        }
    },

    /**
     * Get most recent weekly report
     */
    getMostRecent: async (req, res) => {
        try {
            const userId = req.user ? req.user.id : 'nR3t7mJhxhIdQvTqSIqX'; // Temporary default user ID

            const report = await WeeklyReport.getMostRecent(userId);

            if (!report) {
                return sendSuccessResponse(res, 'No weekly reports found', null);
            }

            return sendSuccessResponse(res, 'Weekly report retrieved successfully', report);
        } catch (error) {
            console.error('Error in getMostRecent:', error);
            return sendErrorResponse(res, 'Failed to get weekly report', 500);
        }
    }
};

module.exports = WeeklyReportController;