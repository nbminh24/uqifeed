/**
 * One Stop Text Analysis Controller
 * Handles the comprehensive text analysis flow from food description to nutritional insights
 */

const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');
const TextAnalyzerService = require('../services/textAnalyzerService');
const Food = require('../models/food');
const Ingredient = require('../models/ingredient');
const NutritionScore = require('../models/nutritionScore');
const NutritionComment = require('../models/nutritionComment');
const TargetNutrition = require('../models/targetNutrition');
const NutritionScoreCalculator = require('../services/nutritionScoreCalculator');
const NutritionCommentService = require('../services/nutritionCommentService');
const { calculateCalories } = require('../utils/nutritionCalculator');

const OneStopTextAnalysisController = {
    /**
     * Process text description, analyze food, save to database, calculate nutrition,
     * generate score and comments, and return comprehensive results
     * @route POST /api/one-stop-text-analysis
     * @access Private
     */
    processFullTextAnalysis: async (req, res) => {
        try {
            const { textDescription, meal_type_id } = req.body;

            // Validate required fields
            if (!textDescription) {
                return sendErrorResponse(
                    res,
                    'Text description is required',
                    400
                );
            }

            if (!meal_type_id) {
                return sendErrorResponse(
                    res,
                    'Meal type ID is required',
                    400
                );
            }

            // Step 1: Process the text description and extract food data
            const processingResults = await TextAnalyzerService.processText(textDescription);

            if (!processingResults || !processingResults.foodData) {
                return sendErrorResponse(
                    res,
                    'Failed to analyze food text',
                    500
                );
            }

            const foodData = processingResults.foodData;            // Step 2: Save food to database
            const food = {
                user_id: req.user.id,
                meal_type_id,
                food_text_description: textDescription,
                food_name: foodData.foodName,
                food_description: foodData.foodDescription,
                food_advice: foodData.foodAdvice,
                food_preparation: foodData.foodPreparation,
                // Initialize nutrition values as 0 instead of null
                total_protein: 0,
                total_carb: 0,
                total_fat: 0,
                total_fiber: 0,
                total_calorie: 0
            };

            const savedFood = await Food.save(food);

            // Step 3: Extract and save ingredients
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

            // Save ingredients
            const savedIngredients = ingredients.length > 0 ?
                await Ingredient.saveMany(ingredients) : [];

            // Step 4: Calculate total nutrition values from ingredients
            let totalProtein = 0;
            let totalCarb = 0;
            let totalFat = 0;
            let totalFiber = 0;
            let totalCalorie = 0; savedIngredients.forEach(ingredient => {
                if (ingredient.ingredient_protein) totalProtein += ingredient.ingredient_protein;
                if (ingredient.ingredient_carb) totalCarb += ingredient.ingredient_carb;
                if (ingredient.ingredient_fat) totalFat += ingredient.ingredient_fat;
                if (ingredient.ingredient_fiber) totalFiber += ingredient.ingredient_fiber;
            });

            // Calculate calories using the utility function (already rounds to whole number)
            totalCalorie = calculateCalories(totalProtein, totalCarb, totalFat);            // Update food with calculated nutrition values
            const updatedFood = await Food.update(savedFood.id, {
                total_protein: totalProtein || 0,
                total_carb: totalCarb || 0,
                total_fat: totalFat || 0,
                total_fiber: totalFiber || 0,
                total_calorie: totalCalorie || 0
            });            // Step 5: Get target nutrition for the user
            const targetNutrition = await TargetNutrition.findByUserId(req.user.id);

            // Create a default target nutrition if none exists
            const defaultTargetNutrition = targetNutrition || {
                id: 'default',
                userId: req.user.id,
                daily: {
                    calories: 2000,
                    protein: 50,
                    fat: 70,
                    carbs: 260,
                    fiber: 25
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            if (!targetNutrition) {
                console.log('No target nutrition found for user. Using default values.');

                // Return success with default target nutrition
                return sendSuccessResponse(
                    res,
                    'Food analyzed from text and saved successfully, using default target nutrition values',
                    {
                        food: updatedFood,
                        ingredients: savedIngredients,
                        targetNutrition: defaultTargetNutrition
                    }
                );
            }

            // Step 6: Calculate nutrition score
            const score = NutritionScoreCalculator.calculateScore(updatedFood, targetNutrition);
            const interpretation = NutritionScoreCalculator.getScoreInterpretation(score);
            const comparisons = NutritionScoreCalculator.getNutritionComparisons(updatedFood, targetNutrition);

            // Save nutrition score
            const scoreData = {
                nutrition_score: score,
                food_id: updatedFood.id,
                target_nutrition_id: targetNutrition.id,
                interpretation: interpretation,
                comparisons: comparisons
            };

            const savedScore = await NutritionScore.save(scoreData);            // Step 7: Generate nutrition comments
            const comments = NutritionCommentService.generateAllComments(
                updatedFood,
                targetNutrition,
                meal_type_id
            );

            // Save comments to database
            const savedComments = {};
            for (const nutrientType in comments) {
                const comment = comments[nutrientType];
                const nutritionType = nutrientType; // using the key directly
                const commentData = {
                    food_id: updatedFood.id,
                    target_nutrition_id: targetNutrition.id,
                    nutrition_type: nutritionType,
                    nutrition_delta: comment.percentage,
                    nutrition_comment: comment.comment,
                    icon: comment.icon,
                    meal_type_id: meal_type_id // Use consistent naming: meal_type_id instead of meal_type
                };

                const nutritionComment = new NutritionComment(commentData);
                savedComments[nutrientType] = await nutritionComment.save();
            }
            // Step 8: Return comprehensive results
            return sendSuccessResponse(
                res,
                'Complete food text analysis successful',
                {
                    food: updatedFood,
                    ingredients: savedIngredients,
                    nutritionScore: savedScore,
                    nutritionComments: Object.values(savedComments),
                    targetNutrition: targetNutrition
                }
            );

        } catch (error) {
            console.error('Error in one-stop text analysis:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error processing complete food text analysis',
                500
            );
        }
    }
};

module.exports = OneStopTextAnalysisController;
