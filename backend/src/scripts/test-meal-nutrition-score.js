/**
 * Script to test meal nutrition score calculation functionality
 */

const Food = require('../models/food');
const TargetNutrition = require('../models/targetNutrition');
const FoodRecord = require('../models/foodRecord');
const NutritionScoreCalculator = require('../services/nutritionScoreCalculator');
const User = require('../models/user');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testMealNutritionScore() {
    try {
        console.log('=== MEAL NUTRITION SCORE TESTING ===');

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

        // Find food items for testing
        console.log('\nFinding foods to calculate meal score for...');
        const testFoodIds = ['m1nI1QwutJ5E07s4dEIr']; // Add more food IDs here
        const foodItems = [];

        for (const foodId of testFoodIds) {
            const food = await Food.findById(foodId);
            if (food) {
                foodItems.push(food);
                console.log(`Found food: ${food.id} - ${food.food_name}`);
                console.log('- Calories:', food.total_calorie);
                console.log('- Protein:', food.total_protein, 'g');
                console.log('- Carbs:', food.total_carb, 'g');
                console.log('- Fat:', food.total_fat, 'g');
                console.log('- Fiber:', food.total_fiber, 'g');
            } else {
                console.log(`Food with ID ${foodId} not found.`);
            }
        }

        if (foodItems.length === 0) {
            console.log('No foods found. Please check the food IDs.');
            process.exit(1);
            return;
        }

        // Test different scoring methods
        console.log('\n=== TESTING DIFFERENT SCORING METHODS ===');

        // 1. Calculate regular score for the first food
        console.log('\n1. REGULAR NUTRITION SCORE (COMPARED TO DAILY TARGETS)');
        const regularScore = NutritionScoreCalculator.calculateScore(foodItems[0], targetNutrition);
        console.log('Regular nutrition score:', regularScore, 'out of 100');

        const regularInterpretation = NutritionScoreCalculator.getScoreInterpretation(regularScore);
        console.log('Interpretation:', regularInterpretation.rating, '-', regularInterpretation.description);

        // 2. Calculate meal-type adjusted score for the first food (as lunch)
        console.log('\n2. MEAL-TYPE ADJUSTED SCORE (AS LUNCH)');
        const lunchScore = NutritionScoreCalculator.calculateScoreByMealType(foodItems[0], targetNutrition, 'lunch');
        console.log('Lunch-adjusted nutrition score:', lunchScore, 'out of 100');

        const lunchInterpretation = NutritionScoreCalculator.getScoreInterpretation(lunchScore);
        console.log('Interpretation:', lunchInterpretation.rating, '-', lunchInterpretation.description);

        // Get meal-adjusted comparisons
        const lunchComparisons = NutritionScoreCalculator.getNutritionComparisonsByMealType(
            foodItems[0],
            targetNutrition,
            'lunch'
        );

        console.log('\nLunch-adjusted nutrition comparisons:');
        console.log('Calories:');
        console.log('- Food:', lunchComparisons.calories.food, 'kcal');
        console.log('- Target for lunch:', lunchComparisons.calories.target, 'kcal');
        console.log('- Percentage of lunch target:', lunchComparisons.calories.percentage + '%');
        console.log('- Deviation from lunch target:', lunchComparisons.calories.deviation + '%');

        // 3. Calculate combined score if we had multiple foods
        if (foodItems.length > 1) {
            console.log('\n3. COMBINED NUTRITION SCORE (MULTIPLE FOODS)');
            const combinedScore = NutritionScoreCalculator.calculateCombinedScore(foodItems, targetNutrition);
            console.log('Combined nutrition score:', combinedScore, 'out of 100');

            const combinedInterpretation = NutritionScoreCalculator.getScoreInterpretation(combinedScore);
            console.log('Interpretation:', combinedInterpretation.rating, '-', combinedInterpretation.description);
        } else {
            console.log('\n3. COMBINED NUTRITION SCORE (MULTIPLE FOODS)');
            console.log('Skipped - need multiple foods to test this.');
        }

        console.log('\n=== MEAL NUTRITION SCORE TESTING COMPLETED SUCCESSFULLY ===');
    } catch (error) {
        console.error('Error testing meal nutrition score:', error);
        process.exit(1);
    }
}

// Run the function
testMealNutritionScore();
