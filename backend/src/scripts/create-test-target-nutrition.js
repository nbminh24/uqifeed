/**
 * Script to create a target nutrition profile for the test user
 */
require('dotenv').config();
const TargetNutrition = require('../models/targetNutrition');

async function createTestTargetNutrition() {
    try {
        // Delete any existing target nutrition for the test user
        const existingTargets = await TargetNutrition.findByUserId('test-user-id');
        if (existingTargets) {
            console.log('Deleting existing target nutrition...');
            await TargetNutrition.delete(existingTargets.id);
        }

        // Create new target nutrition
        const targetNutrition = {
            userId: 'test-user-id', // Note: using userId not user_id to match the model
            daily_calorie_target: 2000,
            daily_protein_target: 70,
            daily_carb_target: 250,
            daily_fat_target: 60,
            daily_fiber_target: 25,
            breakfast_ratio: 0.25,
            lunch_ratio: 0.35,
            dinner_ratio: 0.30,
            snack_ratio: 0.10
        };

        const savedTarget = await TargetNutrition.create(targetNutrition);
        console.log('Target nutrition created successfully:', savedTarget);
    } catch (error) {
        console.error('Error creating target nutrition:', error);
    }
}

// Run the function
createTestTargetNutrition()
    .then(() => {
        console.log('Script completed');
        process.exit(0);
    })
    .catch(error => {
        console.error('Script failed:', error);
        process.exit(1);
    });
