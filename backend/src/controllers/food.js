const Food = require('../models/food');
const Ingredient = require('../models/ingredient');
const NutritionComment = require('../models/nutritionComment');
const NutritionScore = require('../models/nutritionScore');
const ImageProcessingService = require('../services/uploadService');
const GeminiService = require('../services/geminiService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');

/**
 * Food Controller
 * Handles food-related operations including Gemini API food analysis
 */
const FoodController = {
    /**
     * Analyze and save food from image
     * @route POST /api/foods/analyze-and-save
     * @access Private
     */
    analyzeAndSaveFood: async (req, res) => {
        try {
            const { base64Image, meal_type_id } = req.body;

            // Validate required fields
            if (!base64Image) {
                return sendErrorResponse(
                    res,
                    'Image is required',
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

            // Analyze food image with Gemini API
            const analysisResult = await GeminiService.analyzeFoodImage(base64Image);

            if (!analysisResult || !analysisResult.foodData) {
                return sendErrorResponse(
                    res,
                    'Failed to analyze food image',
                    500
                );
            } const foodData = analysisResult.foodData;            // Extract data for food table
            const food = {
                user_id: req.user ? req.user.id : 'nR3t7mJhxhIdQvTqSIqX', // Add fallback for testing
                meal_type_id,
                food_image: base64Image,
                food_name: foodData.foodName,
                food_description: foodData.foodDescription,
                food_advice: foodData.foodAdvice,
                food_preparation: foodData.foodPreparation,
                // Initialize total nutrient values as null, to be calculated later
                total_protein: null,
                total_carb: null,
                total_fat: null,
                total_fiber: null,
                total_calorie: null
            };

            // Save food to database
            const savedFood = await Food.save(food);

            // Extract and save ingredients
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

            // Save ingredients if there are any
            let savedIngredients = [];
            if (ingredients.length > 0) {
                savedIngredients = await Ingredient.saveMany(ingredients);
            }

            return sendSuccessResponse(
                res,
                'Food analyzed and saved successfully',
                {
                    food: savedFood,
                    ingredients: savedIngredients
                },
                201
            );
        } catch (error) {
            console.error('Error analyzing and saving food:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error analyzing and saving food',
                500
            );
        }
    },

    /**
     * Get user's foods
     * @route GET /api/foods
     * @access Private
     */
    getUserFoods: async (req, res) => {
        try {
            const { limit, sortBy, sortDir, meal_type_id } = req.query;

            const options = {
                limit: limit ? parseInt(limit) : undefined,
                sortBy: sortBy || 'created_at',
                sortDir: sortDir || 'desc'
            }; let foods;
            if (meal_type_id) {
                foods = await Food.findByMealType(meal_type_id, {
                    ...options,
                    userId: req.user ? req.user.id : 'nR3t7mJhxhIdQvTqSIqX'
                });
            } else {
                foods = await Food.findByUserId(req.user ? req.user.id : 'nR3t7mJhxhIdQvTqSIqX', options);
            }

            return sendSuccessResponse(
                res,
                'Foods retrieved successfully',
                { foods }
            );
        } catch (error) {
            console.error('Error getting user foods:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving foods',
                500
            );
        }
    },

    /**
     * Get food by ID with ingredients
     * @route GET /api/foods/:id
     * @access Private
     */
    getFoodById: async (req, res) => {
        try {
            const food = await Food.findById(req.params.id);

            if (!food) {
                return sendErrorResponse(
                    res,
                    'Food not found',
                    404
                );
            }            // Check if user owns the food or is admin
            // Skip check during testing with mock token
            const isTest = !req.user || req.user.id === 'nR3t7mJhxhIdQvTqSIqX';
            if (!isTest && food.user_id !== req.user.id && req.user.role !== 'admin') {
                return sendErrorResponse(
                    res,
                    'Not authorized to access this food',
                    403
                );
            }

            // Get ingredients for this food
            const ingredients = await Ingredient.findByFoodId(food.id);

            return sendSuccessResponse(
                res,
                'Food retrieved successfully',
                { food, ingredients }
            );
        } catch (error) {
            console.error('Error getting food by ID:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving food',
                500
            );
        }
    },

    /**
     * Update food
     * @route PUT /api/foods/:id
     * @access Private
     */    updateFood: async (req, res) => {
        try {
            const { meal_type_id, food_name, food_description, food_advice, food_preparation } = req.body;

            const food = await Food.findById(req.params.id);

            if (!food) {
                return sendErrorResponse(
                    res,
                    'Food not found',
                    404
                );
            }

            // Check if user owns the food or is admin
            // Skip check during testing with mock token
            const isTest = !req.user || req.user.id === 'nR3t7mJhxhIdQvTqSIqX';
            if (!isTest && food.user_id !== req.user.id && req.user.role !== 'admin') {
                return sendErrorResponse(
                    res,
                    'Not authorized to update this food',
                    403
                );
            }

            // Prepare update data
            const updateData = {};
            if (meal_type_id) updateData.meal_type_id = meal_type_id;
            if (food_name) updateData.food_name = food_name;
            if (food_description) updateData.food_description = food_description;
            if (food_advice) updateData.food_advice = food_advice;
            if (food_preparation) updateData.food_preparation = food_preparation;

            // Update food
            const updatedFood = await Food.update(req.params.id, updateData);

            return sendSuccessResponse(
                res,
                'Food updated successfully',
                { food: updatedFood }
            );
        } catch (error) {
            console.error('Error updating food:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error updating food',
                500
            );
        }
    },

    /**
     * Delete food and its ingredients
     * @route DELETE /api/foods/:id
     * @access Private
     */    deleteFood: async (req, res) => {
        try {
            const food = await Food.findById(req.params.id);

            if (!food) {
                return sendErrorResponse(
                    res,
                    'Food not found',
                    404
                );
            }

            // Check if user owns the food or is admin
            // Skip check during testing with mock token
            const isTest = !req.user || req.user.id === 'nR3t7mJhxhIdQvTqSIqX';
            if (!isTest && food.user_id !== req.user.id && req.user.role !== 'admin') {
                return sendErrorResponse(
                    res,
                    'Not authorized to delete this food',
                    403
                );
            }

            // Delete associated ingredients first
            await Ingredient.deleteByFoodId(food.id);

            // Delete food
            await Food.delete(food.id);

            return sendSuccessResponse(
                res,
                'Food and ingredients deleted successfully',
                null
            );
        } catch (error) {
            console.error('Error deleting food:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error deleting food',
                500
            );
        }
    },

    /**
     * Calculate and update total nutritional values for a food
     * @route POST /api/foods/:id/calculate-nutrition
     * @access Private
     */    calculateNutrition: async (req, res) => {
        try {
            const food = await Food.findById(req.params.id);

            if (!food) {
                return sendErrorResponse(
                    res,
                    'Food not found',
                    404
                );
            }

            // Check if user owns the food or is admin
            // Skip check during testing with mock token
            const isTest = !req.user || req.user.id === 'nR3t7mJhxhIdQvTqSIqX';
            if (!isTest && food.user_id !== req.user.id && req.user.role !== 'admin') {
                return sendErrorResponse(
                    res,
                    'Not authorized to update this food',
                    403
                );
            }

            // Get ingredients for this food
            const ingredients = await Ingredient.findByFoodId(food.id);

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

            // Update food with calculated nutritional values
            const updatedFood = await Food.update(food.id, {
                total_protein: totalProtein,
                total_carb: totalCarb,
                total_fat: totalFat,
                total_fiber: totalFiber,
                total_calorie: totalCalorie
            });

            return sendSuccessResponse(
                res,
                'Nutritional values calculated and updated successfully',
                { food: updatedFood }
            );
        } catch (error) {
            console.error('Error calculating nutrition:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error calculating nutritional values',
                500
            );
        }
    },

    /**
     * Get detailed food information including related data
     * @route GET /api/foods/:id/detailed
     * @access Private
     */
    getFoodWithDetails: async (req, res) => {
        try {
            // Get food data
            const food = await Food.findById(req.params.id);

            if (!food) {
                return sendErrorResponse(
                    res,
                    'Food not found',
                    404
                );
            }

            // Check if user owns the food or is admin
            // Skip check during testing with mock token
            const isTest = !req.user || req.user.id === 'nR3t7mJhxhIdQvTqSIqX';
            if (!isTest && food.user_id !== req.user.id && req.user.role !== 'admin') {
                return sendErrorResponse(
                    res,
                    'Not authorized to access this food',
                    403
                );
            }

            // Get ingredients for this food
            const ingredients = await Ingredient.findByFoodId(food.id);

            // Get nutrition comments for this food
            const nutritionComments = await NutritionComment.findByFoodId(food.id);

            // Get nutrition score for this food
            const nutritionScore = await NutritionScore.findByFoodId(food.id);

            return sendSuccessResponse(
                res,
                'Detailed food information retrieved successfully',
                {
                    food,
                    ingredients,
                    nutritionComments,
                    nutritionScore
                }
            );
        } catch (error) {
            console.error('Error getting detailed food information:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving detailed food information',
                500
            );
        }
    },
};

module.exports = FoodController;
