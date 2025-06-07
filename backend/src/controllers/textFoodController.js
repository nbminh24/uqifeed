/**
 * Text Food Controller
 * Handles creating and updating food entries from text descriptions
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

const TextFoodController = {
    /**
     * Create food entry from text analysis
     * @route POST /api/text-food/create
     * @access Private
     */
    createFood: async (req, res) => {
        try {
            const { textDescription, meal_type_id } = req.body;

            // Validate required fields
            if (!textDescription || !meal_type_id) {
                return sendErrorResponse(
                    res,
                    'Text description and meal type ID are required',
                    400
                );
            }

            // Process the text
            const processingResults = await TextAnalyzerService.processText(textDescription);
            if (!processingResults?.foodData) {
                return sendErrorResponse(res, 'Failed to analyze food text', 500);
            }

            const foodData = processingResults.foodData;

            // Calculate nutrition values
            let totalProtein = 0, totalCarb = 0, totalFat = 0, totalFiber = 0;

            if (Array.isArray(foodData.foodIngredientList)) {
                foodData.foodIngredientList.forEach(item => {
                    const extractNumber = (value) => {
                        if (!value) return 0;
                        if (typeof value === 'number') return value;
                        const matches = value.toString().match(/(\d+(\.\d+)?)/);
                        return matches ? parseFloat(matches[0]) : 0;
                    };

                    const amount = extractNumber(item['Ingredient Amount']) || 100;
                    const multiplier = amount / 100;

                    totalProtein += extractNumber(item['Ingredient Protein']) * multiplier;
                    totalCarb += extractNumber(item['Ingredient Carb']) * multiplier;
                    totalFat += extractNumber(item['Ingredient Fat']) * multiplier;
                    totalFiber += extractNumber(item['Ingredient Fiber']) * multiplier;
                });
            }

            const totalCalorie = calculateCalories(totalProtein, totalCarb, totalFat);

            // Create food entry
            const food = await Food.save({
                user_id: req.user.id,
                meal_type_id,
                food_text_description: textDescription,
                food_name: foodData.foodName,
                food_description: foodData.foodDescription,
                food_advice: foodData.foodAdvice,
                food_preparation: foodData.foodPreparation,
                total_protein: totalProtein,
                total_carb: totalCarb,
                total_fat: totalFat,
                total_fiber: totalFiber,
                total_calorie: totalCalorie
            });

            // Save ingredients
            const ingredients = foodData.foodIngredientList?.map(item => ({
                food_id: food.id,
                ingredient_name: item['Ingredient Name'] || '',
                ingredient_amount: parseFloat(item['Ingredient Amount']) || 0,
                ingredient_description: item['Ingredient Description'] || {},
                ingredient_protein: parseFloat(item['Ingredient Protein']) || 0,
                ingredient_carb: parseFloat(item['Ingredient Carb']) || 0,
                ingredient_fat: parseFloat(item['Ingredient Fat']) || 0,
                ingredient_fiber: parseFloat(item['Ingredient Fiber']) || 0
            })) || [];

            const savedIngredients = await Ingredient.saveMany(ingredients);

            // Get target nutrition and calculate score/comments
            const targetNutrition = await TargetNutrition.findByUserId(req.user.id);
            if (!targetNutrition) {
                return sendSuccessResponse(res, 'Food saved without nutrition analysis', {
                    food,
                    ingredients: savedIngredients
                });
            }

            // Calculate score
            const score = NutritionScoreCalculator.calculateScore(food, targetNutrition);
            const interpretation = NutritionScoreCalculator.getScoreInterpretation(score);
            const comparisons = NutritionScoreCalculator.getNutritionComparisons(food, targetNutrition);

            const scoreData = {
                nutrition_score: score,
                food_id: food.id,
                target_nutrition_id: targetNutrition.id,
                interpretation,
                comparisons
            };

            const savedScore = await NutritionScore.save(scoreData);

            // Generate and save comments
            const comments = NutritionCommentService.generateAllComments(
                food,
                targetNutrition,
                meal_type_id
            );

            const savedComments = {};
            for (const nutrientType in comments) {
                const comment = comments[nutrientType];
                const commentData = {
                    food_id: food.id,
                    target_nutrition_id: targetNutrition.id,
                    nutrition_type: nutrientType,
                    nutrition_delta: comment.percentage,
                    nutrition_comment: comment.comment,
                    icon: comment.icon,
                    meal_type: meal_type_id
                };

                const nutritionComment = new NutritionComment(commentData);
                savedComments[nutrientType] = await nutritionComment.save();
            }

            return sendSuccessResponse(res, 'Food created successfully', {
                food,
                ingredients: savedIngredients,
                nutritionScore: {
                    score: savedScore.nutrition_score,
                    interpretation: savedScore.interpretation
                },
                nutritionComments: Object.values(savedComments),
                targetNutrition
            });

        } catch (error) {
            console.error('Error creating food from text:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error creating food from text',
                500
            );
        }
    },

    /**
     * Update food entry from text analysis
     * @route PUT /api/text-food/:foodId
     * @access Private
     */
    updateFood: async (req, res) => {
        try {
            const { foodId } = req.params;
            const { textDescription, meal_type_id } = req.body;

            // Validate required fields
            if (!foodId || !textDescription || !meal_type_id) {
                return sendErrorResponse(
                    res,
                    'Food ID, text description and meal type ID are required',
                    400
                );
            }

            // Check if food exists
            const existingFood = await Food.findById(foodId);
            if (!existingFood) {
                return sendErrorResponse(res, 'Food not found', 404);
            }

            // Process the text
            const processingResults = await TextAnalyzerService.processText(textDescription);
            if (!processingResults?.foodData) {
                return sendErrorResponse(res, 'Failed to analyze food text', 500);
            }

            const foodData = processingResults.foodData;

            // Calculate nutrition values
            let totalProtein = 0, totalCarb = 0, totalFat = 0, totalFiber = 0;

            if (Array.isArray(foodData.foodIngredientList)) {
                foodData.foodIngredientList.forEach(item => {
                    const extractNumber = (value) => {
                        if (!value) return 0;
                        if (typeof value === 'number') return value;
                        const matches = value.toString().match(/(\d+(\.\d+)?)/);
                        return matches ? parseFloat(matches[0]) : 0;
                    };

                    const amount = extractNumber(item['Ingredient Amount']) || 100;
                    const multiplier = amount / 100;

                    totalProtein += extractNumber(item['Ingredient Protein']) * multiplier;
                    totalCarb += extractNumber(item['Ingredient Carb']) * multiplier;
                    totalFat += extractNumber(item['Ingredient Fat']) * multiplier;
                    totalFiber += extractNumber(item['Ingredient Fiber']) * multiplier;
                });
            }

            const totalCalorie = calculateCalories(totalProtein, totalCarb, totalFat);            // Prepare update data while preserving existing image
            const updateData = {
                meal_type_id,
                food_text_description: textDescription,
                food_name: foodData.foodName,
                food_description: foodData.foodDescription,
                food_advice: foodData.foodAdvice,
                food_preparation: foodData.foodPreparation,
                total_protein: totalProtein,
                total_carb: totalCarb,
                total_fat: totalFat,
                total_fiber: totalFiber,
                total_calorie: totalCalorie
            };

            // Only include image-related fields if they exist
            if (existingFood.food_image) {
                updateData.food_image = existingFood.food_image;
            }
            if (existingFood.cloudinary_public_id) {
                updateData.cloudinary_public_id = existingFood.cloudinary_public_id;
            }

            // Update food
            const updatedFood = await Food.update(foodId, updateData);

            // Update ingredients
            await Ingredient.deleteByFoodId(foodId);

            const ingredients = foodData.foodIngredientList?.map(item => ({
                food_id: foodId,
                ingredient_name: item['Ingredient Name'] || '',
                ingredient_amount: parseFloat(item['Ingredient Amount']) || 0,
                ingredient_description: item['Ingredient Description'] || {},
                ingredient_protein: parseFloat(item['Ingredient Protein']) || 0,
                ingredient_carb: parseFloat(item['Ingredient Carb']) || 0,
                ingredient_fat: parseFloat(item['Ingredient Fat']) || 0,
                ingredient_fiber: parseFloat(item['Ingredient Fiber']) || 0
            })) || [];

            const savedIngredients = await Ingredient.saveMany(ingredients);

            // Get target nutrition and calculate score/comments
            const targetNutrition = await TargetNutrition.findByUserId(req.user.id);
            if (!targetNutrition) {
                return sendSuccessResponse(res, 'Food updated without nutrition analysis', {
                    food: updatedFood,
                    ingredients: savedIngredients
                });
            }

            // Update score
            const score = NutritionScoreCalculator.calculateScore(updatedFood, targetNutrition);
            const interpretation = NutritionScoreCalculator.getScoreInterpretation(score);
            const comparisons = NutritionScoreCalculator.getNutritionComparisons(updatedFood, targetNutrition);

            await NutritionScore.deleteByFoodId(foodId);
            const scoreData = {
                nutrition_score: score,
                food_id: foodId,
                target_nutrition_id: targetNutrition.id,
                interpretation,
                comparisons
            };

            const savedScore = await NutritionScore.save(scoreData);

            // Update comments
            await NutritionComment.deleteByFoodId(foodId);
            const comments = NutritionCommentService.generateAllComments(
                updatedFood,
                targetNutrition,
                meal_type_id
            );

            const savedComments = {};
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

                const nutritionComment = new NutritionComment(commentData);
                savedComments[nutrientType] = await nutritionComment.save();
            }

            return sendSuccessResponse(res, 'Food updated successfully', {
                food: updatedFood,
                ingredients: savedIngredients,
                nutritionScore: {
                    score: savedScore.nutrition_score,
                    interpretation: savedScore.interpretation
                },
                nutritionComments: Object.values(savedComments),
                targetNutrition
            });

        } catch (error) {
            console.error('Error updating food from text:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error updating food from text',
                500
            );
        }
    }
};

module.exports = TextFoodController;
