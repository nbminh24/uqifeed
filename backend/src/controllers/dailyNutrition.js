const FoodHistory = require('../models/foodHistory');
const TargetNutrition = require('../models/targetNutrition');
const DailyNutrition = require('../models/dailyNutrition');
const { startOfDay, endOfDay, format } = require('date-fns');

/**
 * Get daily nutrition summary for a specific date
 */
exports.getDailyNutrition = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date parameter is required'
            });
        }

        // TODO: Add proper authentication later
        // const userId = req.user.id;
        const userId = 'nR3t7mJhxhIdQvTqSIqX'; // Temporary default user ID

        // Get user's target nutrition
        let targetNutrition;
        try {
            targetNutrition = await TargetNutrition.findByUserId(userId);
            console.log('Found target nutrition:', targetNutrition);
        } catch (error) {
            console.log('Error fetching target nutrition:', error.message);
            targetNutrition = null;
        }

        // Use default values if no target nutrition found
        if (!targetNutrition) {
            console.log('No target nutrition found, using defaults');
            targetNutrition = {
                daily: {
                    calories: 2000,
                    proteins: 80,
                    fats: 80,
                    carbs: 150
                }
            };
        }        // Format date to YYYY-MM-DD for consistent storage and lookup
        const formattedDate = format(new Date(date), 'yyyy-MM-dd');
        const startDate = startOfDay(new Date(date));
        const endDate = endOfDay(new Date(date));

        console.log('Processing nutrition for date:', formattedDate);

        // Check if we already have calculated daily nutrition for this date
        let dailyNutritionData;
        let totalNutrition;

        try {
            // Try to get pre-calculated daily nutrition first
            dailyNutritionData = await DailyNutrition.findByUserIdAndDate(userId, formattedDate);

            if (dailyNutritionData) {
                console.log('Found pre-calculated daily nutrition:', dailyNutritionData);
                // Use pre-calculated values
                totalNutrition = {
                    calories: dailyNutritionData.calories || 0,
                    proteins: dailyNutritionData.proteins || 0,
                    fats: dailyNutritionData.fats || 0,
                    carbs: dailyNutritionData.carbs || 0
                };
            } else {
                // Calculate from food history
                console.log('No pre-calculated data found, calculating from food history');

                // Get foods for the specified date
                const foods = await FoodHistory.findByDateRange(userId, startDate, endDate);
                console.log(`Found ${foods.length} foods for date range`);

                if (foods.length > 0) {
                    // Calculate and store daily totals
                    dailyNutritionData = await DailyNutrition.calculateAndStoreDailyTotals(
                        userId,
                        formattedDate,
                        foods
                    );

                    totalNutrition = {
                        calories: dailyNutritionData.calories || 0,
                        proteins: dailyNutritionData.proteins || 0,
                        fats: dailyNutritionData.fats || 0,
                        carbs: dailyNutritionData.carbs || 0
                    };
                } else {
                    // No foods found for this date
                    console.log('No foods found for this date');
                    totalNutrition = { calories: 0, proteins: 0, fats: 0, carbs: 0 };
                }
            }
        } catch (error) {
            console.error('Error processing daily nutrition data:', error);
            // Fallback to zero values on error
            totalNutrition = { calories: 0, proteins: 0, fats: 0, carbs: 0 };
        }        // Calculate percentages of target
        const calculatePercentage = (current, target) => {
            if (!target || target === 0) return 0;
            const percentage = (current / target) * 100;
            return Number.isFinite(percentage) ? Math.min(Math.round(percentage), 100) : 0;
        };

        // Access the correct values from target nutrition
        const targetDaily = targetNutrition.daily || targetNutrition;

        const nutritionSummary = {
            calories: {
                current: Math.round(totalNutrition.calories),
                target: Math.round(targetDaily.calories),
                percentage: calculatePercentage(totalNutrition.calories, targetDaily.calories)
            },
            proteins: {
                current: Math.round(totalNutrition.proteins),
                target: Math.round(targetDaily.proteins || targetDaily.protein),
                percentage: calculatePercentage(
                    totalNutrition.proteins,
                    targetDaily.proteins || targetDaily.protein
                )
            },
            fats: {
                current: Math.round(totalNutrition.fats),
                target: Math.round(targetDaily.fats || targetDaily.fat),
                percentage: calculatePercentage(
                    totalNutrition.fats,
                    targetDaily.fats || targetDaily.fat
                )
            },
            carbs: {
                current: Math.round(totalNutrition.carbs),
                target: Math.round(targetDaily.carbs),
                percentage: calculatePercentage(totalNutrition.carbs, targetDaily.carbs)
            }
        };

        console.log('Final nutrition summary:', JSON.stringify(nutritionSummary));

        res.json({
            success: true,
            data: nutritionSummary
        });
    } catch (error) {
        console.error('Error in getDailyNutrition:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get daily nutrition summary',
            error: error.message
        });
    }
};

/**
 * Update daily nutrition for a specific date based on food history
 * This can be called manually or via a scheduled job
 */
exports.updateDailyNutrition = async (req, res) => {
    try {
        const { date, userId } = req.body;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date parameter is required'
            });
        }

        // Use provided userId or get from authenticated user
        const userIdToUse = userId || 'nR3t7mJhxhIdQvTqSIqX'; // Temporary default user ID

        // Format date to YYYY-MM-DD
        const formattedDate = format(new Date(date), 'yyyy-MM-dd');
        const startDate = startOfDay(new Date(date));
        const endDate = endOfDay(new Date(date));

        // Get foods for the specified date
        const foods = await FoodHistory.findByDateRange(userIdToUse, startDate, endDate);
        console.log(`Found ${foods.length} foods for date ${formattedDate}`);

        // Calculate and store daily totals
        const dailyNutritionData = await DailyNutrition.calculateAndStoreDailyTotals(
            userIdToUse,
            formattedDate,
            foods
        );

        res.json({
            success: true,
            message: 'Daily nutrition updated successfully',
            data: dailyNutritionData
        });
    } catch (error) {
        console.error('Error in updateDailyNutrition:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update daily nutrition',
            error: error.message
        });
    }
};

/**
 * Get daily nutrition summary for a date range
 * Useful for week or month views
 */
exports.getDailyNutritionRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Both startDate and endDate parameters are required'
            });
        }

        // TODO: Add proper authentication later
        const userId = 'nR3t7mJhxhIdQvTqSIqX'; // Temporary default user ID

        // Format dates
        const formattedStartDate = format(new Date(startDate), 'yyyy-MM-dd');
        const formattedEndDate = format(new Date(endDate), 'yyyy-MM-dd');

        // Get daily nutrition data for the date range
        const dailyNutritionData = await DailyNutrition.findByUserIdAndDateRange(
            userId,
            formattedStartDate,
            formattedEndDate
        );

        res.json({
            success: true,
            data: dailyNutritionData
        });
    } catch (error) {
        console.error('Error in getDailyNutritionRange:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get daily nutrition range',
            error: error.message
        });
    }
};
