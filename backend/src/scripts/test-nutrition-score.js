/**
 * Script to test nutrition score calculation functionality using the ratio-based method
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

async function testNutritionScore() {
    try {
        console.log('=== NUTRITION SCORE TESTING (RATIO-BASED METHOD) ===');

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

        // Calculate nutrition score
        console.log('\nCalculating nutrition score...');

        // Calculate standard nutritional balance score (ratio-based)
        const score = NutritionScoreCalculator.calculateScore(testFood, targetNutrition);
        console.log('Nutritional balance score:', score, 'out of 100');

        // Create some sample meals to demonstrate combined score calculation
        console.log('\nDemonstrating meal calculations:');

        // Create breakfast example (this food + water)
        const breakfastItems = [
            testFood,
            { total_calorie: 0, total_protein: 0, total_fat: 0, total_carb: 0, total_fiber: 0 } // Water or zero-nutrient item
        ];
        const breakfastScore = NutritionScoreCalculator.calculateCombinedScore(breakfastItems, targetNutrition);
        console.log('Breakfast sample score:', breakfastScore, 'out of 100');

        // Create lunch example (this food + another hypothetical food)
        const lunchItems = [
            testFood,
            { total_calorie: 200, total_protein: 5, total_fat: 3, total_carb: 40, total_fiber: 2 } // e.g., Rice
        ];
        const lunchScore = NutritionScoreCalculator.calculateCombinedScore(lunchItems, targetNutrition);
        console.log('Lunch sample score:', lunchScore, 'out of 100');

        // Create dinner example (this food + vegetables)
        const dinnerItems = [
            testFood,
            { total_calorie: 100, total_protein: 2, total_fat: 1, total_carb: 10, total_fiber: 5 } // e.g., Vegetables
        ];
        const dinnerScore = NutritionScoreCalculator.calculateCombinedScore(dinnerItems, targetNutrition);
        console.log('Dinner sample score:', dinnerScore, 'out of 100');

        // Create snack example (half portion of this food)
        const snackFood = {
            total_calorie: testFood.total_calorie / 2,
            total_protein: testFood.total_protein / 2,
            total_fat: testFood.total_fat / 2,
            total_carb: testFood.total_carb / 2,
            total_fiber: testFood.total_fiber / 2
        };
        const snackScore = NutritionScoreCalculator.calculateScore(snackFood, targetNutrition);
        console.log('Snack sample score:', snackScore, 'out of 100');

        // Use the standard score for the remainder of the test        console.log('Nutrition score:', score, 'out of 100');

        // Get score interpretation
        const interpretation = NutritionScoreCalculator.getScoreInterpretation(score);
        console.log('Score interpretation:');
        console.log('- Rating:', interpretation.rating);
        console.log('- Description:', interpretation.description);

        // Get detailed nutrition comparisons
        const comparisons = NutritionScoreCalculator.getNutritionComparisons(testFood, targetNutrition);
        console.log('\nDetailed nutrition comparisons:');

        // Display traditional nutrient comparisons
        console.log('Calories:');
        console.log('- Food:', comparisons.calories.food, 'kcal');
        console.log('- Target:', comparisons.calories.target, 'kcal');
        console.log('- Percentage of target:', comparisons.calories.percentage + '%');
        console.log('- Deviation from target:', comparisons.calories.deviation + '%');

        console.log('Protein:');
        console.log('- Food:', comparisons.protein.food, 'g');
        console.log('- Target:', comparisons.protein.target, 'g');
        console.log('- Percentage of target:', comparisons.protein.percentage + '%');
        console.log('- Deviation from target:', comparisons.protein.deviation + '%');

        console.log('Fat:');
        console.log('- Food:', comparisons.fat.food, 'g');
        console.log('- Target:', comparisons.fat.target, 'g');
        console.log('- Percentage of target:', comparisons.fat.percentage + '%');
        console.log('- Deviation from target:', comparisons.fat.deviation + '%');

        console.log('Carbs:');
        console.log('- Food:', comparisons.carbs.food, 'g');
        console.log('- Target:', comparisons.carbs.target, 'g');
        console.log('- Percentage of target:', comparisons.carbs.percentage + '%');
        console.log('- Deviation from target:', comparisons.carbs.deviation + '%');

        console.log('Fiber:');
        console.log('- Food:', comparisons.fiber.food, 'g');
        console.log('- Target:', comparisons.fiber.target, 'g');
        console.log('- Percentage of target:', comparisons.fiber.percentage + '%');
        console.log('- Deviation from target:', comparisons.fiber.deviation + '%');

        // Display ratio-based nutritional balance information
        console.log('\nNutritional balance analysis:');
        console.log('- Total food macronutrients:', comparisons.nutritionalBalance.totalFoodGrams.toFixed(1), 'g');
        console.log('- Total target macronutrients:', comparisons.nutritionalBalance.totalTargetGrams.toFixed(1), 'g');
        console.log('- Average ratio difference:', comparisons.nutritionalBalance.avgRatioDifference);

        console.log('\nNutrient ratios:');
        console.log('Protein:');
        console.log('- Food ratio:', comparisons.protein.foodRatio + '%');
        console.log('- Target ratio:', comparisons.protein.targetRatio + '%');
        console.log('- Ratio difference:', comparisons.protein.ratioDifference + '%');

        console.log('Fat:');
        console.log('- Food ratio:', comparisons.fat.foodRatio + '%');
        console.log('- Target ratio:', comparisons.fat.targetRatio + '%');
        console.log('- Ratio difference:', comparisons.fat.ratioDifference + '%');

        console.log('Carbs:');
        console.log('- Food ratio:', comparisons.carbs.foodRatio + '%');
        console.log('- Target ratio:', comparisons.carbs.targetRatio + '%');
        console.log('- Ratio difference:', comparisons.carbs.ratioDifference + '%');

        console.log('Fiber:');
        console.log('- Food ratio:', comparisons.fiber.foodRatio + '%');
        console.log('- Target ratio:', comparisons.fiber.targetRatio + '%');
        console.log('- Ratio difference:', comparisons.fiber.ratioDifference + '%');

        // Save nutrition score to database
        console.log('\nSaving nutrition score to database...');

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
testNutritionScore();
