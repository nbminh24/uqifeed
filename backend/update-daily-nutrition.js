// Update Daily Nutrition Script
// This script will calculate and update daily nutrition totals based on food history
// It can be run manually or scheduled to run daily

const { db } = require('./src/config/firebase');
const { format, subDays } = require('date-fns');
const FoodHistory = require('./src/models/foodHistory');
const DailyNutrition = require('./src/models/dailyNutrition');

// Number of days to process (from today backwards)
const DAYS_TO_PROCESS = 30;

// Test user ID - update as needed
const TEST_USER_ID = 'nR3t7mJhxhIdQvTqSIqX';

/**
 * Update daily nutrition for a specific date and user
 */
async function updateDailyNutritionForDate(userId, date) {
    try {
        console.log(`Processing date ${date} for user ${userId}...`);

        // Format date strings
        const formattedDate = format(date, 'yyyy-MM-dd');

        // Get food history for the date
        const startDate = new Date(formattedDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(formattedDate);
        endDate.setHours(23, 59, 59, 999);

        // Get foods from database
        const foods = await FoodHistory.findByDateRange(userId, startDate, endDate);
        console.log(`Found ${foods.length} food items for ${formattedDate}`);

        // Even if no foods found, create a record with zeros to avoid repeated calculations
        if (foods.length === 0) {
            console.log(`No foods found for ${formattedDate}, creating empty record...`);
            
            // Create an empty nutrition record
            const emptyData = {
                userId,
                date: formattedDate,
                calories: 0,
                proteins: 0,
                fats: 0,
                carbs: 0,
                foodCount: 0,
                lastUpdated: new Date().toISOString()
            };
            
            const result = await DailyNutrition.createOrUpdate(emptyData);
            console.log(`Created empty nutrition record for ${formattedDate}`);
            return result;
        }

        // Calculate and store daily nutrition
        const result = await DailyNutrition.calculateAndStoreDailyTotals(
            userId,
            formattedDate,
            foods
        );

        console.log(`Successfully updated daily nutrition for ${formattedDate}`);
        return result;
    } catch (error) {
        console.error(`Error updating daily nutrition for ${date}:`, error);
        return null;
    }
}

/**
 * Process multiple days for a user
 */
async function processDaysForUser(userId, daysToProcess) {
    console.log(`Starting daily nutrition update for user ${userId}`);
    console.log(`Processing ${daysToProcess} days of data...`);

    const results = [];
    const today = new Date();

    for (let i = 0; i < daysToProcess; i++) {
        const date = subDays(today, i);
        const result = await updateDailyNutritionForDate(userId, date);

        if (result) {
            results.push(result);
        }
    }

    console.log(`Processed ${results.length} days with data`);
    return results;
}

// Run the script
async function main() {
    try {
        console.log('Starting Daily Nutrition Update Script');

        const results = await processDaysForUser(TEST_USER_ID, DAYS_TO_PROCESS);

        console.log('Script completed successfully!');
        console.log(`Updated daily nutrition for ${results.length} days`);

        // Exit process
        process.exit(0);
    } catch (error) {
        console.error('Error running script:', error);
        process.exit(1);
    }
}

// Run the main function
main();
