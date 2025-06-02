/**
 * Script to create sample food and ingredient data in Firebase
 * This will create real data that persists in the database
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const GeminiService = require('../services/geminiService');
const Food = require('../models/food');
const Ingredient = require('../models/ingredient');
// Import the nutrition calculator utility
const { calculateCalories } = require('../utils/nutritionCalculator');

// Configuration
const IMAGE_PATH = 'C:\\Users\\USER\\Downloads\\suon-cuu-nuong.webp';
const USER_ID = 'nR3t7mJhxhIdQvTqSIqX'; // Your admin user ID

async function createSampleFoodData() {
    try {
        console.log('=== CREATING SAMPLE FOOD DATA ===');
        console.log('Starting at:', new Date().toISOString());

        // Convert image to base64
        console.log('Reading and converting image to base64...');
        const imageBuffer = fs.readFileSync(IMAGE_PATH);
        const mimeType = 'image/webp';
        const base64Image = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;

        // Analyze food with Gemini API
        console.log('Analyzing food image with Gemini API...');
        const analysisResult = await GeminiService.analyzeFoodImage(base64Image);

        if (!analysisResult || !analysisResult.foodData) {
            console.error('Failed to analyze food image');
            return;
        }

        console.log('Food analysis complete!');
        console.log('Food name:', analysisResult.foodData.foodName);

        // Create food object
        const foodData = analysisResult.foodData;
        const food = {
            user_id: USER_ID,
            meal_type_id: 'lunch',
            food_name: foodData.foodName,
            food_description: foodData.foodDescription,
            food_advice: foodData.foodAdvice,
            food_preparation: foodData.foodPreparation,
            total_protein: null,
            total_carb: null,
            total_fat: null,
            total_fiber: null,
            total_calorie: null,
            // Store a shortened version of the image for demo purposes (to avoid storage issues)
            food_image_preview: base64Image.substring(0, 1000) + '...[truncated]'
        };

        // Save food to database with explicit error handling
        console.log('Saving food to Firestore...');
        let savedFood;
        try {
            savedFood = await Food.save(food);
            console.log('Food saved successfully with ID:', savedFood.id);
        } catch (error) {
            console.error('Error saving food to Firestore:', error);
            return;
        }

        // Create ingredients
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

        // Save ingredients with explicit error handling
        console.log(`Saving ${ingredients.length} ingredients to Firestore...`);
        try {
            if (ingredients.length > 0) {
                const savedIngredients = await Ingredient.saveMany(ingredients);
                console.log('Ingredients saved successfully, count:', savedIngredients.length);

                // Log first ingredient for verification
                if (savedIngredients.length > 0) {
                    console.log('First ingredient:', {
                        id: savedIngredients[0].id,
                        name: savedIngredients[0].ingredient_name,
                        food_id: savedIngredients[0].food_id
                    });
                }
            } else {
                console.log('No ingredients to save');
            }
        } catch (error) {
            console.error('Error saving ingredients to Firestore:', error);
            // Continue execution to update the food with nutrition values
        }

        // Calculate nutrition values
        console.log('Calculating nutrition values...');
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
        });        // Calculate calories using the utility function (already rounds to whole number)
        totalCalorie = calculateCalories(totalProtein, totalCarb, totalFat);

        // Update food with nutrition values
        console.log('Updating food with calculated nutrition values...');
        try {
            const updatedFood = await Food.update(savedFood.id, {
                total_protein: totalProtein,
                total_carb: totalCarb,
                total_fat: totalFat,
                total_fiber: totalFiber,
                total_calorie: totalCalorie
            });

            console.log('Food updated with nutrition values:');
            console.log('- Protein:', totalProtein, 'g');
            console.log('- Carbs:', totalCarb, 'g');
            console.log('- Fat:', totalFat, 'g');
            console.log('- Fiber:', totalFiber, 'g');
            console.log('- Calories:', totalCalorie, 'kcal');
        } catch (error) {
            console.error('Error updating food with nutrition values:', error);
        }

        console.log('\n=== SAMPLE DATA CREATION COMPLETED ===');
        console.log('Food ID:', savedFood.id);
        console.log('Food Name:', savedFood.food_name);
        console.log('Ingredient count:', ingredients.length);
        console.log('\nTo view the data in Firebase Console:');
        console.log(`1. Go to https://console.firebase.google.com/project/${process.env.FIREBASE_PROJECT_ID}/firestore/data/`);
        console.log('2. Check the "foods" collection and look for document ID:', savedFood.id);
        console.log('3. Check the "ingredients" collection for documents with food_id:', savedFood.id);

        return {
            foodId: savedFood.id,
            ingredientCount: ingredients.length
        };
    } catch (error) {
        console.error('Error creating sample food data:', error);
    }
}

// Execute the function
createSampleFoodData();
