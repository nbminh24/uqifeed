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

const TextUpdateAnalysisController = {
    /**
     * Update existing food with new text analysis
     * @route POST /api/text-analysis/update/:foodId
     * @access Private
     */
    updateFoodWithTextAnalysis: async (req, res) => {
        try {
            const { foodId } = req.params;
            const { textDescription, meal_type_id } = req.body;

            // Validate required fields
            if (!textDescription) {
                return sendErrorResponse(res, 'Text description is required', 400);
            }

            if (!meal_type_id) {
                return sendErrorResponse(res, 'Meal type ID is required', 400);
            }

            // Get original food to preserve timestamps
            const originalFood = await Food.findById(foodId);
            if (!originalFood) {
                return sendErrorResponse(res, 'Food not found', 404);
            }

            // Step 1: Process the text description and extract food data
            const processingResults = await TextAnalyzerService.processText(textDescription);
            if (!processingResults || !processingResults.foodData) {
                return sendErrorResponse(res, 'Failed to analyze food text', 500);
            }

            const foodData = processingResults.foodData;

            // Step 2: Update food base data
            const food = {
                meal_type_id,
                food_text_description: textDescription,
                food_name: foodData.foodName,
                food_description: foodData.foodDescription,
                food_advice: foodData.foodAdvice,
                food_preparation: foodData.foodPreparation,
                food_image: originalFood.food_image,
                total_protein: 0,
                total_carb: 0,
                total_fat: 0,
                total_fiber: 0,
                total_calorie: 0
            };

            const updatedFood = await Food.update(foodId, food);

            // Step 3: Delete old ingredients and save new ones
            await Ingredient.deleteByFoodId(foodId);

            const ingredients = [];
            if (Array.isArray(foodData.foodIngredientList)) {
                for (const item of foodData.foodIngredientList) {
                    const extractNumber = (value) => {
                        if (!value) return null;
                        const matches = value.toString().match(/(\d+(\.\d+)?)/);
                        return matches ? parseFloat(matches[0]) : null;
                    };

                    const ingredient = {
                        food_id: foodId,
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

            const savedIngredients = ingredients.length > 0
                ? await Ingredient.saveMany(ingredients)
                : [];

            // Step 4: Calculate total nutrition values from ingredients
            let totalProtein = 0;
            let totalCarb = 0;
            let totalFat = 0;
            let totalFiber = 0;
            let totalCalorie = 0;

            savedIngredients.forEach(ingredient => {
                const amount = ingredient.ingredient_amount || 100;
                const multiplier = amount / 100;

                if (ingredient.ingredient_protein) totalProtein += ingredient.ingredient_protein * multiplier;
                if (ingredient.ingredient_carb) totalCarb += ingredient.ingredient_carb * multiplier;
                if (ingredient.ingredient_fat) totalFat += ingredient.ingredient_fat * multiplier;
                if (ingredient.ingredient_fiber) totalFiber += ingredient.ingredient_fiber * multiplier;
            });

            totalCalorie = calculateCalories(totalProtein, totalCarb, totalFat);

            // Update food with calculated nutrition values
            const foodWithNutrition = await Food.update(foodId, {
                total_protein: totalProtein || 0,
                total_carb: totalCarb || 0,
                total_fat: totalFat || 0,
                total_fiber: totalFiber || 0,
                total_calorie: totalCalorie || 0
            });

            // Step 5: Get target nutrition for the user
            const targetNutrition = await TargetNutrition.findByUserId(req.user.id);
            if (!targetNutrition) {
                return sendSuccessResponse(
                    res,
                    'Food updated successfully, but no nutrition score calculated (no target nutrition)',
                    {
                        food: foodWithNutrition,
                        ingredients: savedIngredients
                    }
                );
            }

            // Step 6: Calculate and save nutrition score
            const score = NutritionScoreCalculator.calculateScore(foodWithNutrition, targetNutrition);
            const interpretation = NutritionScoreCalculator.getScoreInterpretation(score);
            const comparisons = NutritionScoreCalculator.getNutritionComparisons(foodWithNutrition, targetNutrition);

            // Delete old score if exists
            await NutritionScore.deleteByFoodId(foodId);

            // Save new score
            const scoreData = {
                nutrition_score: score,
                food_id: foodId,
                target_nutrition_id: targetNutrition.id,
                interpretation: interpretation,
                comparisons: comparisons
            };

            const savedScore = await NutritionScore.save(scoreData);

            // Step 7: Generate and save nutrition comments
            await NutritionComment.deleteByFoodId(foodId);

            const comments = NutritionCommentService.generateAllComments(
                foodWithNutrition,
                targetNutrition,
                meal_type_id
            );

            const savedComments = [];
            for (const nutrientType in comments) {
                const comment = comments[nutrientType];
                const commentData = {
                    food_id: foodId,
                    target_nutrition_id: targetNutrition.id,
                    nutrition_type: nutrientType,
                    nutrition_delta: comment.percentage,
                    nutrition_comment: comment.comment,
                    icon: comment.icon,
                    meal_type: meal_type_id
                };

                const savedComment = await NutritionComment.save(commentData);
                if (savedComment) {
                    savedComments.push(savedComment);
                }
            }

            // Step 8: Return comprehensive results
            return sendSuccessResponse(
                res,
                'Food updated successfully with new analysis',
                {
                    food: foodWithNutrition,
                    ingredients: savedIngredients,
                    nutritionScore: {
                        ...savedScore,
                        interpretation: savedScore.interpretation
                    },
                    nutritionComments: savedComments,
                    targetNutrition
                }
            );

        } catch (error) {
            console.error('Error updating food with text analysis:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error processing food update',
                500
            );
        }
    }
};

module.exports = TextUpdateAnalysisController;
