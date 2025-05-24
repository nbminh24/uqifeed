/**
 * Script to test food and ingredient storage functionality
 * Direct approach (bypassing HTTP API) for faster testing
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Import services and models directly
const GeminiService = require('../services/geminiService');
const Food = require('../models/food');
const Ingredient = require('../models/ingredient');

// Configuration
const IMAGE_PATH = 'C:\\Users\\USER\\Downloads\\suon-cuu-nuong.webp';
let foodId;

/**
 * Convert file to base64
 */
function fileToBase64(filePath) {
    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Get file extension and set appropriate mime type
    const extension = path.extname(filePath).toLowerCase();
    let mimeType;

    switch (extension) {
        case '.webp':
            mimeType = 'image/webp';
            break;
        case '.jpg':
        case '.jpeg':
            mimeType = 'image/jpeg';
            break;
        case '.png':
            mimeType = 'image/png';
            break;
        default:
            mimeType = 'application/octet-stream';
    }

    // Return complete base64 data URL
    return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
}

/**
 * Test analyzing and saving food directly
 */
async function testAnalyzeAndSaveFood() {
    try {
        console.log('\n--- Test 1: Analyze Food Image ---');

        // Convert image to base64
        console.log('Reading and converting image to base64...');
        const base64Image = fileToBase64(IMAGE_PATH);

        // Analyze food with Gemini API
        console.log('Analyzing food image with Gemini API...');
        const analysisResult = await GeminiService.analyzeFoodImage(base64Image);

        if (!analysisResult || !analysisResult.foodData) {
            console.error('Failed to analyze food image');
            return;
        }

        console.log('Food analysis complete!');
        console.log('Food name:', analysisResult.foodData.foodName);

        // Save food to database
        console.log('\n--- Test 2: Save Food to Database ---');
        const foodData = analysisResult.foodData;

        const food = {
            user_id: 'nR3t7mJhxhIdQvTqSIqX',
            meal_type_id: 'lunch',
            food_image: base64Image,
            food_name: foodData.foodName,
            food_description: foodData.foodDescription,
            food_advice: foodData.foodAdvice,
            food_preparation: foodData.foodPreparation,
            total_protein: null,
            total_carb: null,
            total_fat: null,
            total_fiber: null,
            total_calorie: null
        };

        const savedFood = await Food.save(food);
        foodId = savedFood.id;

        console.log('Food saved to database:');
        console.log('- ID:', foodId);
        console.log('- Name:', savedFood.food_name);

        // Save ingredients
        const ingredients = [];
        if (Array.isArray(foodData.foodIngredientList)) {
            for (const item of foodData.foodIngredientList) {
                // Extract numeric values and remove non-numeric characters
                const extractNumber = (value) => {
                    if (!value) return null;
                    const matches = value.toString().match(/(\d+(\.\d+)?)/);
                    return matches ? parseFloat(matches[0]) : null;
                };

                const ingredient = {
                    food_id: savedFood.id,
                    ingredient_name: item['Ingredient Name'] || '',
                    ingredient_amount: extractNumber(item['Ingredient Amount']),
                    ingredient_description: item['Ingredient Description'] || {},
                    ingredient_protein: extractNumber(item['Ingredient Protein']),
                    ingredient_carb: extractNumber(item['Ingredient Carb']),
                    ingredient_fat: extractNumber(item['Ingredient Fat']),
                    ingredient_fiber: extractNumber(item['Ingredient Fiber'])
                };
                ingredients.push(ingredient);
            }
        }

        if (ingredients.length > 0) {
            const savedIngredients = await Ingredient.saveMany(ingredients);
            console.log('Ingredients saved:', savedIngredients.length);
        } else {
            console.log('No ingredients to save');
        }

        return { foodId, food: savedFood };
    } catch (error) {
        console.error('Error analyzing and saving food:', error);
    }
}

/**
 * Test retrieving food and ingredients
 */
async function testGetFood(id) {
    try {
        console.log('\n--- Test 3: Get Food by ID ---');

        const food = await Food.findById(id);
        if (!food) {
            console.log('Food not found');
            return;
        }

        console.log('Food retrieved:');
        console.log('- Name:', food.food_name);

        // Get ingredients
        const ingredients = await Ingredient.findByFoodId(id);
        console.log('- Ingredients count:', ingredients.length);

        // Display some ingredient details
        if (ingredients.length > 0) {
            console.log('- Ingredient samples:');
            ingredients.slice(0, 2).forEach((ing, i) => {
                console.log(`  ${i + 1}. ${ing.ingredient_name}`);
            });
        }

        return { food, ingredients };
    } catch (error) {
        console.error('Error getting food:', error);
    }
}

/**
 * Test calculating nutrition
 */
async function testCalculateNutrition(id, ingredients) {
    try {
        console.log('\n--- Test 4: Calculate Nutrition ---');

        if (!ingredients || ingredients.length === 0) {
            console.log('No ingredients available to calculate nutrition');
            return;
        }

        // Calculate total nutritional values
        let totalProtein = 0;
        let totalCarb = 0;
        let totalFat = 0;
        let totalFiber = 0;
        let totalCalorie = 0;

        ingredients.forEach(ingredient => {
            if (ingredient.ingredient_protein) totalProtein += ingredient.ingredient_protein;
            if (ingredient.ingredient_carb) totalCarb += ingredient.ingredient_carb;
            if (ingredient.ingredient_fat) totalFat += ingredient.ingredient_fat;
            if (ingredient.ingredient_fiber) totalFiber += ingredient.ingredient_fiber;
        });

        // Calculate calories: 4 calories per gram of protein, 4 per gram of carbs, 9 per gram of fat
        totalCalorie = (totalProtein * 4) + (totalCarb * 4) + (totalFat * 9);

        // Update food with calculated values
        const updatedFood = await Food.update(id, {
            total_protein: totalProtein,
            total_carb: totalCarb,
            total_fat: totalFat,
            total_fiber: totalFiber,
            total_calorie: totalCalorie
        });

        console.log('Nutrition calculated:');
        console.log('- Protein:', totalProtein.toFixed(2), 'g');
        console.log('- Carbs:', totalCarb.toFixed(2), 'g');
        console.log('- Fat:', totalFat.toFixed(2), 'g');
        console.log('- Fiber:', totalFiber.toFixed(2), 'g');
        console.log('- Calories:', totalCalorie.toFixed(2), 'kcal');

        return updatedFood;
    } catch (error) {
        console.error('Error calculating nutrition:', error);
    }
}

/**
 * Test updating food
 */
async function testUpdateFood(id) {
    try {
        console.log('\n--- Test 5: Update Food ---');

        const updateData = {
            food_name: `Updated: ${new Date().toISOString().split('T')[0]}`,
            food_advice: {
                "Nutrition Summary": "Updated nutrition summary",
                "Healthier Suggestions": "Updated health suggestions",
                "Consumption Tips": "Updated consumption tips"
            }
        };

        const updatedFood = await Food.update(id, updateData);

        console.log('Food updated:');
        console.log('- New name:', updatedFood.food_name);

        return updatedFood;
    } catch (error) {
        console.error('Error updating food:', error);
    }
}

/**
 * Test deleting food
 */
async function testDeleteFood(id) {
    try {
        console.log('\n--- Test 6: Delete Food ---');

        // Delete ingredients first
        const deletedCount = await Ingredient.deleteByFoodId(id);
        console.log(`${deletedCount} ingredients deleted`);

        // Delete food
        const result = await Food.delete(id);
        if (result) {
            console.log('Food deleted successfully');
        } else {
            console.log('Failed to delete food');
        }

        return result;
    } catch (error) {
        console.error('Error deleting food:', error);
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log('=== FOOD FUNCTIONALITY TESTING (DIRECT VERSION) ===');
    console.log('Starting tests at:', new Date().toISOString());
    console.log('This test bypasses the HTTP API for faster results');

    try {
        // Step 1: Analyze and save food
        const { foodId: savedFoodId } = await testAnalyzeAndSaveFood() || {};

        if (!savedFoodId) {
            console.log('Failed to save food, ending tests');
            return;
        }

        // Step 2: Get food details
        const { ingredients } = await testGetFood(savedFoodId) || {};

        // Step 3: Calculate nutrition
        await testCalculateNutrition(savedFoodId, ingredients);

        // Step 4: Update food
        await testUpdateFood(savedFoodId);

        // Step 5: Delete food and ingredients (comment out to keep the test data)
        await testDeleteFood(savedFoodId);

        console.log('\n=== TESTING COMPLETE ===');
        console.log('Finished at:', new Date().toISOString());
    } catch (error) {
        console.error('Error during test execution:', error);
    }
}

// Run tests
runTests();
