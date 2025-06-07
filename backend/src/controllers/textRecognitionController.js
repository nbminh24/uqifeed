/**
 * Text Recognition Controller
 * Handles food recognition from text descriptions without saving or updating
 */

const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');
const TextAnalyzerService = require('../services/textAnalyzerService');

const TextRecognitionController = {
    /**
     * Analyze food text and return the results without saving
     * @route POST /api/text-recognition/analyze
     * @access Private
     */
    analyzeText: async (req, res) => {
        try {
            const { textDescription } = req.body;

            // Validate required fields
            if (!textDescription) {
                return sendErrorResponse(
                    res,
                    'Text description is required',
                    400
                );
            }

            // Process the text description and extract food data
            const processingResults = await TextAnalyzerService.processText(textDescription);

            if (!processingResults || !processingResults.foodData) {
                return sendErrorResponse(
                    res,
                    'Failed to analyze food text',
                    500
                );
            }

            const foodData = processingResults.foodData;

            // Calculate initial nutrition values
            let totalProtein = 0;
            let totalCarb = 0;
            let totalFat = 0;
            let totalFiber = 0;
            let totalCalorie = 0;

            if (Array.isArray(foodData.foodIngredientList)) {
                foodData.foodIngredientList.forEach(item => {
                    const extractNumber = (value) => {
                        if (!value) return 0;
                        if (typeof value === 'number') return value;
                        const matches = value.toString().match(/(\d+(\.\d+)?)/);
                        return matches ? parseFloat(matches[0]) : 0;
                    };

                    const amount = extractNumber(item['Ingredient Amount']) || 100;
                    const multiplier = amount / 100; // Convert to per 100g basis

                    totalProtein += extractNumber(item['Ingredient Protein']) * multiplier;
                    totalCarb += extractNumber(item['Ingredient Carb']) * multiplier;
                    totalFat += extractNumber(item['Ingredient Fat']) * multiplier;
                    totalFiber += extractNumber(item['Ingredient Fiber']) * multiplier;
                });
            }

            // Calculate total calories
            const calculateCalories = require('../utils/nutritionCalculator').calculateCalories;
            totalCalorie = calculateCalories(totalProtein, totalCarb, totalFat);

            // Return the analysis results
            return sendSuccessResponse(
                res,
                'Food text analyzed successfully',
                {
                    food: {
                        food_name: foodData.foodName,
                        food_description: foodData.foodDescription,
                        food_advice: foodData.foodAdvice,
                        food_preparation: foodData.foodPreparation,
                        total_protein: totalProtein,
                        total_carb: totalCarb,
                        total_fat: totalFat,
                        total_fiber: totalFiber,
                        total_calorie: totalCalorie
                    },
                    ingredients: foodData.foodIngredientList || []
                }
            );
        } catch (error) {
            console.error('Error analyzing food text:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error analyzing food text',
                500
            );
        }
    }
};

module.exports = TextRecognitionController;
