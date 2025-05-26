const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');
const TextAnalyzerService = require('../services/textAnalyzerService');
const Food = require('../models/food');

/**
 * Text Food Analyzer Controller
 * Handles text-based food analysis operations
 */
const TextFoodAnalyzerController = {
    /**
     * Process a text description with Gemini AI
     * @route POST /api/text-analysis/analyze-food
     * @access Private
     */
    analyzeFoodText: async (req, res) => {
        try {
            const { textDescription } = req.body;

            // Check if text description exists
            if (!textDescription) {
                return sendErrorResponse(
                    res,
                    'No text description provided',
                    400
                );
            }

            // Process the text using Text Analyzer Service
            const processingResults = await TextAnalyzerService.processText(textDescription);

            return sendSuccessResponse(
                res,
                'Food text analyzed successfully',
                {
                    foodData: processingResults.foodData
                }
            );
        } catch (error) {
            console.error('Food text analysis error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error analyzing food text',
                500
            );
        }
    },

    /**
     * Analyze and save food from text description
     * @route POST /api/text-analysis/analyze-and-save
     * @access Private
     */
    analyzeAndSaveFood: async (req, res) => {
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

            // Process the text using Text Analyzer Service
            const processingResults = await TextAnalyzerService.processText(textDescription);

            if (!processingResults || !processingResults.foodData) {
                return sendErrorResponse(
                    res,
                    'Failed to analyze food text',
                    500
                );
            }

            const foodData = processingResults.foodData;

            // Extract data for food table
            const food = {
                user_id: req.user.id,
                meal_type_id,
                food_text_description: textDescription, // Store the original text description
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
                const Ingredient = require('../models/ingredient');
                savedIngredients = await Ingredient.saveMany(ingredients);
            }

            // Calculate nutrition automatically (optional)
            // This would be the place to add automatic nutrition calculation if desired

            return sendSuccessResponse(
                res,
                'Food analyzed from text and saved successfully',
                {
                    food: savedFood,
                    ingredients: savedIngredients
                },
                201
            );
        } catch (error) {
            console.error('Error analyzing and saving food from text:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error analyzing and saving food',
                500
            );
        }
    }
};

module.exports = TextFoodAnalyzerController;
