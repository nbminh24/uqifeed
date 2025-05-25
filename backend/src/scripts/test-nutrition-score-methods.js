/**
 * Script to test nutrition score calculation with comprehensive output
 */

const Food = require('../models/food');
const TargetNutrition = require('../models/targetNutrition');
const NutritionScore = require('../models/nutritionScore');
const NutritionScoreCalculator = require('../services/nutritionScoreCalculator');
const NutritionScoreHelper = require('../services/nutritionScoreHelper');
const User = require('../models/user');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testNutritionScoreDetailed() {
    try {
        console.log('=== DETAILED NUTRITION SCORE ANALYSIS ===');

        // Find admin user
        console.log('Finding admin user...');
        const admin = await User.findByEmail('admin@gmail.com');

        if (!admin) {
            console.log('Admin user not found. Please create admin user first.');
            process.exit(1);
            return;
        }

        console.log('Found admin user:', admin.id);

        // Find admin target nutrition
        console.log('Finding admin target nutrition...');
        const targetNutrition = await TargetNutrition.findById('LOjgsvV7Pl1XFUGPr5LN');

        if (!targetNutrition) {
            console.log('Target nutrition not found. Please check the ID.');
            process.exit(1);
            return;
        }

        console.log('Found target nutrition:', targetNutrition.id);
        console.log('Target daily nutrition:');
        console.log('- Calories:', targetNutrition.daily.calories);
        console.log('- Protein:', targetNutrition.daily.protein, 'g');
        console.log('- Carbs:', targetNutrition.daily.carbs, 'g');
        console.log('- Fat:', targetNutrition.daily.fat, 'g');
        console.log('- Fiber:', targetNutrition.daily.fiber, 'g');

        // Find a food to calculate score for
        console.log('\nFinding food to calculate score for...');
        const testFood = await Food.findById('m1nI1QwutJ5E07s4dEIr');

        if (!testFood) {
            console.log('Food not found. Please check the ID.');
            process.exit(1);
            return;
        }

        console.log('Found food:', testFood.id, '-', testFood.food_name);
        console.log('Food nutrition:');
        console.log('- Calories:', testFood.total_calorie);
        console.log('- Protein:', testFood.total_protein, 'g');
        console.log('- Carbs:', testFood.total_carb, 'g');
        console.log('- Fat:', testFood.total_fat, 'g');
        console.log('- Fiber:', testFood.total_fiber, 'g');

        console.log('\n=== CALCULATING NUTRITION SCORE (RATIO-BASED METHOD) ===');

        // Calculate score
        const score = NutritionScoreCalculator.calculateScore(testFood, targetNutrition);

        console.log('\nRatio-based nutritional balance score:');
        console.log('Score:', score, 'out of 100');
        const interpretation = NutritionScoreCalculator.getScoreInterpretation(score);
        console.log('Interpretation:', interpretation.rating, '-', interpretation.description);

        // Get detailed nutrition comparisons
        const comparisons = NutritionScoreCalculator.getNutritionComparisons(testFood, targetNutrition);

        console.log('\n=== NUTRITIONAL BALANCE ANALYSIS ===');
        console.log('\nNutritional composition ratios:');

        // Total macronutrients
        const totalFood = comparisons.nutritionalBalance?.totalFoodGrams || 0;
        const totalTarget = comparisons.nutritionalBalance?.totalTargetGrams || 0;

        console.log('Total macronutrients in food:', totalFood.toFixed(1), 'g');
        console.log('Total macronutrients in target:', totalTarget.toFixed(1), 'g');

        console.log('\nProtein:');
        console.log('- Food ratio:', comparisons.protein?.foodRatio || 0, '%');
        console.log('- Target ratio:', comparisons.protein?.targetRatio || 0, '%');
        console.log('- Ratio difference:', comparisons.protein?.ratioDifference || 0, '%');

        console.log('\nFat:');
        console.log('- Food ratio:', comparisons.fat?.foodRatio || 0, '%');
        console.log('- Target ratio:', comparisons.fat?.targetRatio || 0, '%');
        console.log('- Ratio difference:', comparisons.fat?.ratioDifference || 0, '%');

        console.log('\nCarbs:');
        console.log('- Food ratio:', comparisons.carbs?.foodRatio || 0, '%');
        console.log('- Target ratio:', comparisons.carbs?.targetRatio || 0, '%');
        console.log('- Ratio difference:', comparisons.carbs?.ratioDifference || 0, '%');

        console.log('\nFiber:');
        console.log('- Food ratio:', comparisons.fiber?.foodRatio || 0, '%');
        console.log('- Target ratio:', comparisons.fiber?.targetRatio || 0, '%');
        console.log('- Ratio difference:', comparisons.fiber?.ratioDifference || 0, '%');

        console.log('\nAverage ratio difference:', comparisons.nutritionalBalance?.avgRatioDifference || 0);
        console.log('This translates to a nutritional balance score of:', score);

        // Save the score
        console.log('\n=== SAVING NUTRITION SCORE ===');

        // Check if score already exists
        const existingScore = await NutritionScore.findByFoodId(testFood.id);

        const scoreData = {
            nutrition_score: score,
            food_id: testFood.id,
            target_nutrition_id: targetNutrition.id,
            interpretation: interpretation,
            comparisons: comparisons
        };

        let savedScore;
        if (existingScore) {
            console.log('Existing score found. Updating...');
            savedScore = await NutritionScore.update(existingScore.id, scoreData);
        } else {
            console.log('Creating new score...');
            savedScore = await NutritionScore.save(scoreData);
        }

        console.log('Nutrition score saved with ID:', savedScore.id);

        // Test retrieving the score
        console.log('\nRetrieving saved score...');
        const retrievedScore = await NutritionScore.findById(savedScore.id);
        console.log('Retrieved score:', retrievedScore.nutrition_score);

        console.log('\n=== NUTRITION SCORE TESTING COMPLETED SUCCESSFULLY ===');
    } catch (error) {
        console.error('Error testing nutrition score:', error);
        process.exit(1);
    }
}

// Run the function
testNutritionScoreDetailed();
