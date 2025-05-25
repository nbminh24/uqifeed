/**
 * Script to test nutrition comment functionality
 */

const Food = require('../models/food');
const TargetNutrition = require('../models/targetNutrition');
const NutritionComment = require('../models/nutritionComment');
const NutritionCommentService = require('../services/nutritionCommentService');
const User = require('../models/user');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testNutritionComments() {
    try {
        console.log('=== NUTRITION COMMENT TESTING ===');

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

        // Find a food to calculate comments for
        console.log('\nFinding food to generate comments for...');
        const testFood = await Food.findById('m1nI1QwutJ5E07s4dEIr');

        if (!testFood) {
            console.log('Food not found. Please check the ID.');
            process.exit(1);
            return;
        } console.log('Found food:', testFood.id, '-', testFood.food_name);
        console.log('Food nutrition:');
        console.log('- Calories:', testFood.total_calorie);
        console.log('- Protein:', testFood.total_protein, 'g');
        console.log('- Carbs:', testFood.total_carb, 'g');
        console.log('- Fat:', testFood.total_fat, 'g');
        console.log('- Fiber:', testFood.total_fiber, 'g');
        console.log('- Meal type:', testFood.meal_type_id || 'Not specified');

        // Test with different meal types
        console.log('\n=== TESTING COMMENTS BY MEAL TYPE ===');

        // Display target nutrition for each meal type
        console.log('Target nutrition by meal type:');
        if (targetNutrition.meals) {
            console.log('\nBreakfast target:');
            console.log('- Calories:', targetNutrition.meals.breakfast?.calories || 'N/A');
            console.log('- Protein:', targetNutrition.meals.breakfast?.protein || 'N/A', 'g');
            console.log('- Carbs:', targetNutrition.meals.breakfast?.carbs || 'N/A', 'g');
            console.log('- Fat:', targetNutrition.meals.breakfast?.fat || 'N/A', 'g');
            console.log('- Fiber:', targetNutrition.meals.breakfast?.fiber || 'N/A', 'g');

            console.log('\nLunch target:');
            console.log('- Calories:', targetNutrition.meals.lunch?.calories || 'N/A');
            console.log('- Protein:', targetNutrition.meals.lunch?.protein || 'N/A', 'g');
            console.log('- Carbs:', targetNutrition.meals.lunch?.carbs || 'N/A', 'g');
            console.log('- Fat:', targetNutrition.meals.lunch?.fat || 'N/A', 'g');
            console.log('- Fiber:', targetNutrition.meals.lunch?.fiber || 'N/A', 'g');

            console.log('\nDinner target:');
            console.log('- Calories:', targetNutrition.meals.dinner?.calories || 'N/A');
            console.log('- Protein:', targetNutrition.meals.dinner?.protein || 'N/A', 'g');
            console.log('- Carbs:', targetNutrition.meals.dinner?.carbs || 'N/A', 'g');
            console.log('- Fat:', targetNutrition.meals.dinner?.fat || 'N/A', 'g');
            console.log('- Fiber:', targetNutrition.meals.dinner?.fiber || 'N/A', 'g');

            console.log('\nSnack target:');
            console.log('- Calories:', targetNutrition.meals.snack?.calories || 'N/A');
            console.log('- Protein:', targetNutrition.meals.snack?.protein || 'N/A', 'g');
            console.log('- Carbs:', targetNutrition.meals.snack?.carbs || 'N/A', 'g');
            console.log('- Fat:', targetNutrition.meals.snack?.fat || 'N/A', 'g');
            console.log('- Fiber:', targetNutrition.meals.snack?.fiber || 'N/A', 'g');
        } else {
            console.log('No meal-specific targets found in the target nutrition.');
        }

        // Test for each meal type
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

        for (const mealType of mealTypes) {
            console.log(`\n=== GENERATING NUTRITION COMMENTS FOR ${mealType.toUpperCase()} ===`);

            // Generate comments for this meal type
            const comments = NutritionCommentService.generateAllComments(testFood, targetNutrition, mealType);

            // Display comments for each nutrition type
            console.log('\nProtein:');
            console.log('- Percentage of target:', comments.protein.percentage + '%');
            console.log('- Comment:', comments.protein.comment);

            console.log('\nFat:');
            console.log('- Percentage of target:', comments.fat.percentage + '%');
            console.log('- Comment:', comments.fat.comment);

            console.log('\nCarbohydrates:');
            console.log('- Percentage of target:', comments.carbs.percentage + '%');
            console.log('- Comment:', comments.carbs.comment);

            console.log('\nFiber:');
            console.log('- Percentage of target:', comments.fiber.percentage + '%');
            console.log('- Comment:', comments.fiber.comment);

            console.log('\nCalories:');
            console.log('- Percentage of target:', comments.calories.percentage + '%');
            console.log('- Comment:', comments.calories.comment);
        }        // Save comments to database
        console.log('\n=== SAVING NUTRITION COMMENTS TO DATABASE ===');

        // First, delete any existing comments for this food
        console.log('Deleting existing comments for this food...');
        await NutritionComment.deleteByFoodId(testFood.id);

        // Use the actual meal type from the food or default to lunch
        const foodMealType = testFood.meal_type_id || 'lunch';
        console.log(`Using food's meal type: ${foodMealType}`);

        // Generate comments for the food's specific meal type
        const commentsToSave = NutritionCommentService.generateAllComments(testFood, targetNutrition, foodMealType);

        // Save each comment
        const savedComments = {};

        for (const nutrientType in commentsToSave) {
            const comment = commentsToSave[nutrientType];
            const nutritionType = convertNutrientTypeForDatabase(nutrientType);

            console.log(`Saving ${nutritionType} comment...`);

            const commentData = {
                food_id: testFood.id,
                target_nutrition_id: targetNutrition.id,
                nutrition_type: nutritionType,
                nutrition_delta: comment.percentage,
                nutrition_comment: comment.comment,
                icon: comment.icon,
                meal_type: foodMealType
            };

            savedComments[nutrientType] = await NutritionComment.save(commentData);
            console.log(`- Comment ID: ${savedComments[nutrientType].id}`);
        }

        // Retrieve comments from database
        console.log('\n=== RETRIEVING NUTRITION COMMENTS FROM DATABASE ===');
        const retrievedComments = await NutritionComment.findByFoodId(testFood.id);

        console.log(`Retrieved ${retrievedComments.length} comments for food "${testFood.food_name}":`); retrievedComments.forEach(comment => {
            console.log(`\n${comment.icon} ${comment.nutrition_type}:`);
            console.log('- ID:', comment.id);
            console.log('- Delta:', comment.nutrition_delta + '%');
            console.log('- Comment:', comment.nutrition_comment);
            console.log('- Meal Type:', comment.meal_type || 'Not specified');
        });

        console.log('\n=== NUTRITION COMMENT TESTING COMPLETED SUCCESSFULLY ===');
    } catch (error) {
        console.error('Error testing nutrition comments:', error);
        process.exit(1);
    }
}

/**
 * Convert nutrient type for database storage
 * @param {String} nutrientType - Nutrient type from service
 * @returns {String} Nutrient type for database
 */
function convertNutrientTypeForDatabase(nutrientType) {
    const mapping = {
        protein: 'Protein',
        fat: 'Fat',
        carbs: 'Carb',
        fiber: 'Fiber',
        calories: 'Calorie'
    };

    return mapping[nutrientType] || nutrientType;
}

// Run the function
testNutritionComments();
