/**
 * Direct Nutrition Processor Service
 * Calculates nutrition values, scores, and comments directly from food analysis data
 * without requiring the data to be saved to the database first
 */

const NutritionScoreCalculator = require('./nutritionScoreCalculator');
const NutritionCommentService = require('./nutritionCommentService');

class DirectNutritionProcessor {
    /**
     * Calculate total nutrition values directly from ingredients
     * @param {Array} ingredients - List of ingredients with nutrition values
     * @returns {Object} Total nutrition values
     */
    static calculateTotalNutrition(ingredients) {
        let totalProtein = 0;
        let totalCarb = 0;
        let totalFat = 0;
        let totalFiber = 0;
        let totalCalorie = 0;

        // Iterate through ingredients and sum up values
        ingredients.forEach(ingredient => {
            // Extract numeric values if needed
            const extractNumber = (value) => {
                if (!value) return 0;
                if (typeof value === 'number') return value;
                const matches = value.toString().match(/(\d+(\.\d+)?)/);
                return matches ? parseFloat(matches[0]) : 0;
            };

            const protein = extractNumber(ingredient.ingredient_protein || ingredient['Ingredient Protein']);
            const carb = extractNumber(ingredient.ingredient_carb || ingredient['Ingredient Carb']);
            const fat = extractNumber(ingredient.ingredient_fat || ingredient['Ingredient Fat']);
            const fiber = extractNumber(ingredient.ingredient_fiber || ingredient['Ingredient Fiber']);

            totalProtein += protein;
            totalCarb += carb;
            totalFat += fat;
            totalFiber += fiber;
        });

        // Calculate calories: 4 calories per gram of protein, 4 per gram of carbs, 9 per gram of fat
        totalCalorie = (totalProtein * 4) + (totalCarb * 4) + (totalFat * 9);

        return {
            total_protein: totalProtein,
            total_carb: totalCarb,
            total_fat: totalFat,
            total_fiber: totalFiber,
            total_calorie: totalCalorie
        };
    }

    /**
     * Create a food object with total nutrition from foodData and ingredients
     * @param {Object} foodData - Food data from AI analysis
     * @param {Array} ingredients - Processed ingredients
     * @returns {Object} Food object with nutrition totals
     */
    static createFoodWithNutrition(foodData, ingredients) {
        // Calculate total nutrition
        const nutritionTotals = this.calculateTotalNutrition(ingredients);

        // Create food object
        return {
            food_name: foodData.foodName,
            food_description: foodData.foodDescription,
            food_advice: foodData.foodAdvice,
            food_preparation: foodData.foodPreparation,
            ...nutritionTotals
        };
    }    /**
     * Calculate nutrition score for a food
     * @param {Object} food - Food object with nutrition values
     * @param {Object} targetNutrition - User's target nutrition
     * @returns {Object} Score data
     */
    static calculateNutritionScore(food, targetNutrition) {
        // Convert target nutrition format if needed
        const formattedTarget = this.formatTargetNutrition(targetNutrition);

        // Calculate score
        const score = NutritionScoreCalculator.calculateScore(food, formattedTarget);
        const interpretation = NutritionScoreCalculator.getScoreInterpretation(score);
        const comparisons = NutritionScoreCalculator.getNutritionComparisons(food, formattedTarget);

        return {
            nutrition_score: score,
            interpretation: interpretation,
            comparisons: comparisons,
            score_explanation: {
                note: "This score evaluates how well-balanced the nutritional composition of this food is compared to your target ratios.",
                tip: "A high score means this food has a good balance of nutrients, regardless of the actual quantities."
            }
        };
    }    /**
     * Generate nutrition comments for a food
     * @param {Object} food - Food object with nutrition values
     * @param {Object} targetNutrition - User's target nutrition
     * @param {String} mealType - Meal type (breakfast, lunch, dinner, snack)
     * @returns {Object} Comments data
     */
    static generateNutritionComments(food, targetNutrition, mealType = 'default') {
        // Format the target nutrition to ensure it has the right structure
        const formattedTarget = this.formatTargetNutrition(targetNutrition);
        return NutritionCommentService.generateAllComments(food, formattedTarget, mealType);
    }

    /**
     * Process complete food analysis in one step
     * @param {Object} foodData - Food data from AI analysis
     * @param {Object} targetNutrition - User's target nutrition
     * @param {String} mealType - Meal type
     * @returns {Object} Complete analysis result
     */
    static processComplete(foodData, targetNutrition, mealType = 'default') {
        // Process ingredients
        const ingredients = this.processIngredients(foodData.foodIngredientList);

        // Create food with nutrition totals
        const foodWithNutrition = this.createFoodWithNutrition(foodData, ingredients);

        // Calculate nutrition score
        const nutritionScore = this.calculateNutritionScore(foodWithNutrition, targetNutrition);

        // Generate nutrition comments
        const nutritionComments = this.generateNutritionComments(foodWithNutrition, targetNutrition, mealType);

        // Return complete result
        return {
            food: foodWithNutrition,
            ingredients: ingredients,
            nutritionScore: nutritionScore,
            nutritionComments: nutritionComments
        };
    }

    /**
     * Process ingredients from AI analysis
     * @param {Array} ingredientList - Ingredient list from AI analysis
     * @returns {Array} Processed ingredients
     */
    static processIngredients(ingredientList) {
        if (!Array.isArray(ingredientList)) {
            return [];
        }

        return ingredientList.map(item => {
            const extractNumber = (value) => {
                if (!value) return null;
                const matches = value.toString().match(/(\d+(\.\d+)?)/);
                return matches ? parseFloat(matches[0]) : null;
            };

            return {
                ingredient_name: item['Ingredient Name'] || '',
                ingredient_amount: extractNumber(item['Ingredient Amount']),
                ingredient_description: item['Ingredient Description'] || {},
                ingredient_protein: extractNumber(item['Ingredient Protein']),
                ingredient_carb: extractNumber(item['Ingredient Carb']),
                ingredient_fat: extractNumber(item['Ingredient Fat']),
                ingredient_fiber: extractNumber(item['Ingredient Fiber'])
            };
        });
    }    /**
     * Format target nutrition to the structure expected by NutritionScoreCalculator
     * @param {Object} targetNutrition - Original target nutrition object
     * @returns {Object} Formatted target nutrition
     */
    static formatTargetNutrition(targetNutrition) {
        // Check if the target nutrition already has the expected structure
        if (targetNutrition.daily && targetNutrition.daily.protein !== undefined) {
            return targetNutrition;
        }

        // Handle the case where targetNutrition is in the old format with daily_protein, etc.
        if (targetNutrition.daily_protein !== undefined) {
            return {
                id: targetNutrition.id,
                user_id: targetNutrition.user_id,
                daily: {
                    calories: targetNutrition.daily_calories || 2000,
                    protein: targetNutrition.daily_protein || 50,
                    fat: targetNutrition.daily_fat || 70,
                    carbs: targetNutrition.daily_carbs || 250,
                    fiber: targetNutrition.daily_fiber || 25
                },
                meals: targetNutrition.meals || {
                    breakfast: {
                        calories: (targetNutrition.daily_calories || 2000) * 0.25,
                        protein: (targetNutrition.daily_protein || 50) * 0.25,
                        fat: (targetNutrition.daily_fat || 70) * 0.25,
                        carbs: (targetNutrition.daily_carbs || 250) * 0.25,
                        fiber: (targetNutrition.daily_fiber || 25) * 0.25
                    },
                    lunch: {
                        calories: (targetNutrition.daily_calories || 2000) * 0.35,
                        protein: (targetNutrition.daily_protein || 50) * 0.35,
                        fat: (targetNutrition.daily_fat || 70) * 0.35,
                        carbs: (targetNutrition.daily_carbs || 250) * 0.35,
                        fiber: (targetNutrition.daily_fiber || 25) * 0.35
                    },
                    dinner: {
                        calories: (targetNutrition.daily_calories || 2000) * 0.30,
                        protein: (targetNutrition.daily_protein || 50) * 0.30,
                        fat: (targetNutrition.daily_fat || 70) * 0.30,
                        carbs: (targetNutrition.daily_carbs || 250) * 0.30,
                        fiber: (targetNutrition.daily_fiber || 25) * 0.30
                    },
                    snack: {
                        calories: (targetNutrition.daily_calories || 2000) * 0.10,
                        protein: (targetNutrition.daily_protein || 50) * 0.10,
                        fat: (targetNutrition.daily_fat || 70) * 0.10,
                        carbs: (targetNutrition.daily_carbs || 250) * 0.10,
                        fiber: (targetNutrition.daily_fiber || 25) * 0.10
                    }
                }
            };
        }

        // If we reach here, the targetNutrition doesn't have the structure we expect
        // Return a default structure with fallback values
        console.warn('Using default nutrition values due to unexpected targetNutrition structure', targetNutrition);
        return {
            id: targetNutrition.id || 'default',
            user_id: targetNutrition.user_id || targetNutrition.userId || 'default',
            daily: {
                calories: 2000,
                protein: 50,
                fat: 70,
                carbs: 250,
                fiber: 25
            },
            meals: {
                breakfast: {
                    calories: 500,
                    protein: 12.5,
                    fat: 17.5,
                    carbs: 62.5,
                    fiber: 6.25
                },
                lunch: {
                    calories: 700,
                    protein: 17.5,
                    fat: 24.5,
                    carbs: 87.5,
                    fiber: 8.75
                },
                dinner: {
                    calories: 600,
                    protein: 15,
                    fat: 21,
                    carbs: 75,
                    fiber: 7.5
                },
                snack: {
                    calories: 200,
                    protein: 5,
                    fat: 7,
                    carbs: 25,
                    fiber: 2.5
                }
            }
        };
    }
}

module.exports = DirectNutritionProcessor;
