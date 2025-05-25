const Food = require('../models/food');
const TargetNutrition = require('../models/targetNutrition');
const NutritionScore = require('../models/nutritionScore');
const NutritionScoreCalculator = require('../services/nutritionScoreCalculator');
const NutritionScoreHelper = require('../services/nutritionScoreHelper');
const nutritionScoreConfig = require('../config/nutritionScoreConfig');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');

/**
 * Get the appropriate calculator (simplified to always use the ratio method)
 * @returns {Object} The calculator to use
 */
function getCalculator() {
    return NutritionScoreCalculator;
}

/**
 * Nutrition Score Controller
 * Handles all nutrition score-related operations
 */
const NutritionScoreController = {
    /**
     * Calculate and save nutrition score for a food
     * @route POST /api/nutrition/score/:foodId
     * @access Private
     */
    calculateAndSaveScore: async (req, res) => {
        try {
            const { foodId } = req.params;

            // Get food data
            const food = await Food.findById(foodId);
            if (!food) {
                return sendErrorResponse(
                    res,
                    'Food not found',
                    404
                );
            }

            // Check if food has nutrition values
            if (!food.total_protein && !food.total_carb && !food.total_fat && !food.total_calorie) {
                return sendErrorResponse(
                    res,
                    'Food does not have nutrition values. Please calculate nutrition values first.',
                    400
                );
            }            // Get target nutrition for the user
            const targetNutrition = await TargetNutrition.findByUserId(req.user.id);
            if (!targetNutrition) {
                return sendErrorResponse(
                    res,
                    'Target nutrition not found. Please calculate your nutrition targets first.',
                    404
                );
            }

            // Get the appropriate calculator based on configuration
            const Calculator = getCalculator();

            // Calculate nutrition score
            const score = Calculator.calculateScore(food, targetNutrition);

            // Get score interpretation
            const interpretation = Calculator.getScoreInterpretation(score);

            // Get detailed nutrition comparisons
            const comparisons = Calculator.getNutritionComparisons(food, targetNutrition);            // Check if score already exists for this food and target nutrition
            const existingScore = await NutritionScore.findByFoodId(foodId);

            // Create score data
            const scoreData = {
                nutrition_score: score,
                food_id: foodId,
                target_nutrition_id: targetNutrition.id,
                interpretation: interpretation,
                comparisons: comparisons
            };

            // Add method information if configured
            if (nutritionScoreConfig.storeMethodInfo) {
                scoreData.calculation_method = nutritionScoreConfig.calculationMethod;
            }

            // Add explanation based on method
            if (nutritionScoreConfig.calculationMethod === 'deviation') {
                scoreData.score_explanation = {
                    note: "This score compares a single food item against your FULL daily nutritional needs. A moderate score is normal and expected for individual foods.",
                    tip: "Most foods will score between 40-70 points as they are meant to be part of a balanced diet, not meet all nutritional needs on their own."
                };
            } else {
                scoreData.score_explanation = {
                    note: "This score evaluates how well-balanced the nutritional composition of this food is compared to your target ratios.",
                    tip: "A high score means this food has a good balance of nutrients, regardless of the actual quantities."
                };
            }

            // Include ratio analysis if configured
            if (nutritionScoreConfig.calculationMethod === 'deviation' && nutritionScoreConfig.includeRatioAnalysis) {
                const ratioComparisons = NewCalculator.getNutritionComparisons(food, targetNutrition);
                scoreData.ratio_analysis = {
                    nutritionalBalance: ratioComparisons.nutritionalBalance,
                    nutrientRatios: {
                        protein: {
                            foodRatio: ratioComparisons.protein.foodRatio,
                            targetRatio: ratioComparisons.protein.targetRatio
                        },
                        fat: {
                            foodRatio: ratioComparisons.fat.foodRatio,
                            targetRatio: ratioComparisons.fat.targetRatio
                        },
                        carbs: {
                            foodRatio: ratioComparisons.carbs.foodRatio,
                            targetRatio: ratioComparisons.carbs.targetRatio
                        },
                        fiber: {
                            foodRatio: ratioComparisons.fiber.foodRatio,
                            targetRatio: ratioComparisons.fiber.targetRatio
                        }
                    }
                };
            }

            if (existingScore) {
                // Update existing score
                savedScore = await NutritionScore.update(existingScore.id, scoreData);
            } else {
                // Save new score
                savedScore = await NutritionScore.save(scoreData);
            }

            return sendSuccessResponse(
                res,
                'Nutrition score calculated and saved successfully',
                {
                    score: savedScore,
                    food: {
                        id: food.id,
                        name: food.food_name
                    }
                }
            );
        } catch (error) {
            console.error('Error calculating nutrition score:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error calculating nutrition score',
                500
            );
        }
    },

    /**
     * Get nutrition score for a food
     * @route GET /api/nutrition/score/:foodId
     * @access Private
     */
    getScoreByFoodId: async (req, res) => {
        try {
            const { foodId } = req.params;

            // Get food data
            const food = await Food.findById(foodId);
            if (!food) {
                return sendErrorResponse(
                    res,
                    'Food not found',
                    404
                );
            }

            // Get nutrition score
            const score = await NutritionScore.findByFoodId(foodId);
            if (!score) {
                return sendErrorResponse(
                    res,
                    'Nutrition score not found for this food',
                    404
                );
            }

            return sendSuccessResponse(
                res,
                'Nutrition score retrieved successfully',
                {
                    score,
                    food: {
                        id: food.id,
                        name: food.food_name
                    }
                }
            );
        } catch (error) {
            console.error('Error getting nutrition score:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error getting nutrition score',
                500
            );
        }
    },

    /**
     * Get all nutrition scores for a user
     * @route GET /api/nutrition/scores
     * @access Private
     */
    getAllScores: async (req, res) => {
        try {
            // Get target nutrition for the user
            const targetNutrition = await TargetNutrition.findByUserId(req.user.id);
            if (!targetNutrition) {
                return sendErrorResponse(
                    res,
                    'Target nutrition not found. Please calculate your nutrition targets first.',
                    404
                );
            }

            // Get all scores for this target nutrition
            const scores = await NutritionScore.findByTargetNutritionId(targetNutrition.id);

            // Get food details for each score
            const scoresWithFoodDetails = await Promise.all(scores.map(async (score) => {
                const food = await Food.findById(score.food_id);
                return {
                    ...score,
                    food: food ? {
                        id: food.id,
                        name: food.food_name
                    } : null
                };
            }));

            return sendSuccessResponse(
                res,
                'Nutrition scores retrieved successfully',
                { scores: scoresWithFoodDetails }
            );
        } catch (error) {
            console.error('Error getting nutrition scores:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error getting nutrition scores',
                500
            );
        }
    },

    /**
     * Delete a nutrition score
     * @route DELETE /api/nutrition/score/:scoreId
     * @access Private
     */
    deleteScore: async (req, res) => {
        try {
            const { scoreId } = req.params;

            // Get score
            const score = await NutritionScore.findById(scoreId);
            if (!score) {
                return sendErrorResponse(
                    res,
                    'Nutrition score not found',
                    404
                );
            }

            // Get target nutrition to verify ownership
            const targetNutrition = await TargetNutrition.findById(score.target_nutrition_id);
            if (!targetNutrition || targetNutrition.userId !== req.user.id) {
                return sendErrorResponse(
                    res,
                    'Not authorized to delete this score',
                    403
                );
            }

            // Delete score
            await NutritionScore.delete(scoreId); return sendSuccessResponse(
                res,
                'Nutrition score deleted successfully'
            );
        } catch (error) {
            console.error('Error deleting nutrition score:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error deleting nutrition score',
                500
            );
        }
    },

    /**
     * Compare nutrition score calculation methods
     * @route GET /api/nutrition/score/:foodId/compare
     * @access Private
     */
    compareScoreMethods: async (req, res) => {
        try {
            const { foodId } = req.params;

            // Get food data
            const food = await Food.findById(foodId);
            if (!food) {
                return sendErrorResponse(
                    res,
                    'Food not found',
                    404
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

            // Compare the two methods
            const comparison = NutritionScoreHelper.compareScores(food, targetNutrition);

            return sendSuccessResponse(
                res,
                'Nutrition score methods compared successfully',
                {
                    comparison,
                    food: {
                        id: food.id,
                        name: food.food_name
                    }
                }
            );
        } catch (error) {
            console.error('Error comparing nutrition score methods:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error comparing nutrition score methods',
                500
            );
        }
    }
};

module.exports = NutritionScoreController;
