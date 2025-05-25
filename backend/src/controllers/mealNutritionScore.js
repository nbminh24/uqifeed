const Food = require('../models/food');
const TargetNutrition = require('../models/targetNutrition');
const FoodRecord = require('../models/foodRecord');
const NutritionScore = require('../models/nutritionScore');
const NutritionScoreCalculator = require('../services/nutritionScoreCalculator');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');

/**
 * Meal Nutrition Score Controller
 * Handles operations related to scoring meals (multiple foods together)
 */
const MealNutritionScoreController = {
    /**
     * Calculate nutrition score for a meal (multiple foods)
     * @route POST /api/nutrition/meal-score
     * @access Private
     */
    calculateMealScore: async (req, res) => {
        try {
            const { foodIds, mealType } = req.body;

            // Validate request
            if (!foodIds || !Array.isArray(foodIds) || foodIds.length === 0) {
                return sendErrorResponse(
                    res,
                    'Please provide an array of food IDs',
                    400
                );
            }

            // Validate meal type if provided
            const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
            if (mealType && !validMealTypes.includes(mealType.toLowerCase())) {
                return sendErrorResponse(
                    res,
                    'Invalid meal type. Must be one of: breakfast, lunch, dinner, snack',
                    400
                );
            }

            // Get target nutrition for the user
            const targetNutrition = await TargetNutrition.findByUserId(req.user.id);
            if (!targetNutrition) {
                return sendErrorResponse(
                    res,
                    'Target nutrition not found. Please calculate your nutrition targets first.',
                    404
                );
            }

            // Fetch all food items
            const foodItems = [];
            for (const foodId of foodIds) {
                const food = await Food.findById(foodId);
                if (!food) {
                    return sendErrorResponse(
                        res,
                        `Food with ID ${foodId} not found`,
                        404
                    );
                }

                // Check if food has nutrition values
                if (!food.total_protein && !food.total_carb && !food.total_fat && !food.total_calorie) {
                    return sendErrorResponse(
                        res,
                        `Food ${food.food_name} does not have nutrition values. Please calculate nutrition values first.`,
                        400
                    );
                }

                foodItems.push(food);
            }

            // Calculate combined nutrition values
            const combinedNutrition = {
                total_calorie: 0,
                total_protein: 0,
                total_fat: 0,
                total_carb: 0,
                total_fiber: 0
            };

            foodItems.forEach(food => {
                combinedNutrition.total_calorie += food.total_calorie || 0;
                combinedNutrition.total_protein += food.total_protein || 0;
                combinedNutrition.total_fat += food.total_fat || 0;
                combinedNutrition.total_carb += food.total_carb || 0;
                combinedNutrition.total_fiber += food.total_fiber || 0;
            });

            // Calculate nutrition score
            let score, comparisons;

            if (mealType) {
                // Calculate score with meal type adjustment
                score = NutritionScoreCalculator.calculateScoreByMealType(
                    combinedNutrition,
                    targetNutrition,
                    mealType
                );

                // Get detailed nutrition comparisons adjusted for meal type
                comparisons = NutritionScoreCalculator.getNutritionComparisonsByMealType(
                    combinedNutrition,
                    targetNutrition,
                    mealType
                );
            } else {
                // Calculate score without meal type adjustment
                score = NutritionScoreCalculator.calculateScore(
                    combinedNutrition,
                    targetNutrition
                );

                // Get detailed nutrition comparisons
                comparisons = NutritionScoreCalculator.getNutritionComparisons(
                    combinedNutrition,
                    targetNutrition
                );
            }

            // Get score interpretation
            const interpretation = NutritionScoreCalculator.getScoreInterpretation(score);

            // Prepare food summary for response
            const foodSummary = foodItems.map(food => ({
                id: food.id,
                name: food.food_name,
                calories: food.total_calorie || 0,
                protein: food.total_protein || 0,
                fat: food.total_fat || 0,
                carbs: food.total_carb || 0,
                fiber: food.total_fiber || 0
            }));

            return sendSuccessResponse(
                res,
                'Meal nutrition score calculated successfully',
                {
                    score,
                    interpretation,
                    comparisons,
                    mealType: mealType || 'custom',
                    combinedNutrition,
                    foods: foodSummary
                }
            );
        } catch (error) {
            console.error('Error calculating meal nutrition score:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error calculating meal nutrition score',
                500
            );
        }
    },

    /**
     * Calculate nutrition score for a food record (which may contain multiple foods)
     * @route GET /api/nutrition/food-record-score/:recordId
     * @access Private
     */
    calculateFoodRecordScore: async (req, res) => {
        try {
            const { recordId } = req.params;

            // Get food record
            const foodRecord = await FoodRecord.findById(recordId);
            if (!foodRecord) {
                return sendErrorResponse(
                    res,
                    'Food record not found',
                    404
                );
            }

            // Check if the food record belongs to the user
            if (foodRecord.user_id !== req.user.id) {
                return sendErrorResponse(
                    res,
                    'Not authorized to access this food record',
                    403
                );
            }

            // Get all foods in the record
            const foodIds = foodRecord.foods || [];
            if (foodIds.length === 0) {
                return sendErrorResponse(
                    res,
                    'Food record does not contain any foods',
                    400
                );
            }

            // Get target nutrition for the user
            const targetNutrition = await TargetNutrition.findByUserId(req.user.id);
            if (!targetNutrition) {
                return sendErrorResponse(
                    res,
                    'Target nutrition not found. Please calculate your nutrition targets first.',
                    404
                );
            }

            // Fetch all food items
            const foodItems = [];
            for (const foodId of foodIds) {
                const food = await Food.findById(foodId);
                if (food) {
                    foodItems.push(food);
                }
            }

            if (foodItems.length === 0) {
                return sendErrorResponse(
                    res,
                    'No valid foods found in this record',
                    400
                );
            }

            // Get meal type from food record
            const mealType = foodRecord.meal_type || 'custom';

            // Calculate meal score
            const score = NutritionScoreCalculator.calculateMealScore(
                foodItems,
                targetNutrition,
                mealType
            );

            // Calculate combined nutrition values
            const combinedNutrition = {
                total_calorie: 0,
                total_protein: 0,
                total_fat: 0,
                total_carb: 0,
                total_fiber: 0
            };

            foodItems.forEach(food => {
                combinedNutrition.total_calorie += food.total_calorie || 0;
                combinedNutrition.total_protein += food.total_protein || 0;
                combinedNutrition.total_fat += food.total_fat || 0;
                combinedNutrition.total_carb += food.total_carb || 0;
                combinedNutrition.total_fiber += food.total_fiber || 0;
            });

            // Get detailed nutrition comparisons
            const comparisons = NutritionScoreCalculator.getNutritionComparisonsByMealType(
                combinedNutrition,
                targetNutrition,
                mealType
            );

            // Get score interpretation
            const interpretation = NutritionScoreCalculator.getScoreInterpretation(score);

            // Prepare food summary for response
            const foodSummary = foodItems.map(food => ({
                id: food.id,
                name: food.food_name,
                calories: food.total_calorie || 0,
                protein: food.total_protein || 0,
                fat: food.total_fat || 0,
                carbs: food.total_carb || 0,
                fiber: food.total_fiber || 0
            }));

            return sendSuccessResponse(
                res,
                'Food record nutrition score calculated successfully',
                {
                    score,
                    interpretation,
                    comparisons,
                    mealType,
                    combinedNutrition,
                    recordName: foodRecord.name || 'Food Record',
                    recordDate: foodRecord.date,
                    foods: foodSummary
                }
            );
        } catch (error) {
            console.error('Error calculating food record nutrition score:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error calculating food record nutrition score',
                500
            );
        }
    }
};

module.exports = MealNutritionScoreController;
