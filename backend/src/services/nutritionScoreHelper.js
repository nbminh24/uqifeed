/**
 * Nutrition Score Helper
 * This script helps with nutrition score calculations and utilities.
 */

// Import calculator
const NutritionScoreCalculator = require('./nutritionScoreCalculator');

/**
 * Nutrition Score Helper
 * Provides tools to help with nutrition score calculations and analysis
 */
class NutritionScoreHelper {
    /**
     * Get detailed score analysis
     * @param {Object} foodNutrition - Food nutrition values
     * @param {Object} targetNutrition - Target nutrition values
     * @returns {Object} Detailed score analysis
     */
    static getScoreAnalysis(foodNutrition, targetNutrition) {
        try {
            // Calculate scores
            const score = NutritionScoreCalculator.calculateScore(foodNutrition, targetNutrition);

            // Get interpretation
            const interpretation = NutritionScoreCalculator.getScoreInterpretation(score);

            // Get comparisons
            const comparisons = NutritionScoreCalculator.getNutritionComparisons(foodNutrition, targetNutrition);

            return {
                food: {
                    name: foodNutrition.food_name || 'Unknown Food',
                    calories: foodNutrition.total_calorie || 0,
                    protein: foodNutrition.total_protein || 0,
                    fat: foodNutrition.total_fat || 0,
                    carbs: foodNutrition.total_carb || 0,
                    fiber: foodNutrition.total_fiber || 0
                },
                calculation: {
                    score: score,
                    interpretation: interpretation,
                    comparisons: comparisons
                },
                ratioAnalysis: {
                    proteinRatio: Math.round(comparisons.protein?.foodRatio || 0),
                    fatRatio: Math.round(comparisons.fat?.foodRatio || 0),
                    carbsRatio: Math.round(comparisons.carbs?.foodRatio || 0),
                    fiberRatio: Math.round(comparisons.fiber?.foodRatio || 0)
                }
            };
        } catch (error) {
            console.error('Error analyzing nutrition score:', error);
            return {
                error: error.message || 'Unknown error analyzing score'
            };
        }
    }

    /**
     * Get the calculator
     * @returns {Object} The nutrition score calculator
     */
    static getCalculator() {
        return NutritionScoreCalculator;
    }
}

module.exports = NutritionScoreHelper;

module.exports = NutritionScoreHelper;
