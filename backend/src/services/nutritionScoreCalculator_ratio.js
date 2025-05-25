/**
 * Nutrition Score Calculator Service
 * Calculates nutrition score based on food nutrition and target nutrition using
 * a ratio-based approach to evaluate the nutritional balance of foods.
 */
class NutritionScoreCalculator {
    /**
     * Calculate nutrition score based on the balance of nutrients compared to target ratios
     * @param {Object} foodNutrition - Food nutrition values
     * @param {Object} targetNutrition - Target nutrition values
     * @returns {Number} Nutrition score (0-100)
     */
    static calculateScore(foodNutrition, targetNutrition) {
        try {
            // Extract nutrition values from food
            const foodProtein = foodNutrition.total_protein || 0;
            const foodFat = foodNutrition.total_fat || 0;
            const foodCarb = foodNutrition.total_carb || 0;
            const foodFiber = foodNutrition.total_fiber || 0;

            // Extract target nutrition values
            const targetProtein = targetNutrition.daily.protein || 50;
            const targetFat = targetNutrition.daily.fat || 70;
            const targetCarb = targetNutrition.daily.carbs || 250;
            const targetFiber = targetNutrition.daily.fiber || 25;

            // Step 1: Calculate total macronutrients in grams (excluding calories)
            const totalFoodGrams = foodProtein + foodFat + foodCarb + foodFiber;
            const totalTargetGrams = targetProtein + targetFat + targetCarb + targetFiber;

            // If food has no macronutrients, return a score of 0
            if (totalFoodGrams === 0) {
                return 0;
            }

            // Step 2: Calculate nutrient ratios for food and target
            const foodRatio = {
                protein: foodProtein / totalFoodGrams,
                fat: foodFat / totalFoodGrams,
                carb: foodCarb / totalFoodGrams,
                fiber: foodFiber / totalFoodGrams
            };

            const targetRatio = {
                protein: targetProtein / totalTargetGrams,
                fat: targetFat / totalTargetGrams,
                carb: targetCarb / totalTargetGrams,
                fiber: targetFiber / totalTargetGrams
            };

            // Step 3: Calculate absolute difference between food and target ratios
            const diffs = {
                protein: Math.abs(foodRatio.protein - targetRatio.protein),
                fat: Math.abs(foodRatio.fat - targetRatio.fat),
                carb: Math.abs(foodRatio.carb - targetRatio.carb),
                fiber: Math.abs(foodRatio.fiber - targetRatio.fiber)
            };

            // Step 4: Calculate average difference
            const avgDiff = (diffs.protein + diffs.fat + diffs.carb + diffs.fiber) / 4;

            // Step 5: Convert to score (0-100)
            let score = (1 - avgDiff) * 100;

            // Ensure score is within 0-100 range
            score = Math.max(0, Math.min(100, score));

            // Round to nearest integer
            return Math.round(score);
        } catch (error) {
            console.error('Error calculating nutrition score:', error);
            return 0; // Return 0 in case of error
        }
    }

    /**
     * Calculate nutrition score for multiple foods (a meal)
     * @param {Array} foodItems - Array of food nutrition objects
     * @param {Object} targetNutrition - Target nutrition values
     * @returns {Number} Combined nutrition score (0-100)
     */
    static calculateCombinedScore(foodItems, targetNutrition) {
        try {
            if (!Array.isArray(foodItems) || foodItems.length === 0) {
                return 0;
            }

            // Combine nutrition values from all foods
            const combinedNutrition = {
                total_calorie: 0,
                total_protein: 0,
                total_fat: 0,
                total_carb: 0,
                total_fiber: 0
            };

            // Sum up all nutrition values
            foodItems.forEach(food => {
                combinedNutrition.total_calorie += food.total_calorie || 0;
                combinedNutrition.total_protein += food.total_protein || 0;
                combinedNutrition.total_fat += food.total_fat || 0;
                combinedNutrition.total_carb += food.total_carb || 0;
                combinedNutrition.total_fiber += food.total_fiber || 0;
            });

            // Calculate score using the combined nutrition
            return this.calculateScore(combinedNutrition, targetNutrition);
        } catch (error) {
            console.error('Error calculating combined nutrition score:', error);
            return 0;
        }
    }

    /**
     * Get score interpretation
     * @param {Number} score - Nutrition score (0-100)
     * @returns {Object} Score interpretation
     */
    static getScoreInterpretation(score) {
        if (score >= 90) {
            return {
                rating: 'Excellent',
                description: 'This food has an excellent nutritional balance.'
            };
        } else if (score >= 80) {
            return {
                rating: 'Very Good',
                description: 'This food has a very good nutritional balance.'
            };
        } else if (score >= 70) {
            return {
                rating: 'Good',
                description: 'This food has a good nutritional balance.'
            };
        } else if (score >= 60) {
            return {
                rating: 'Fair',
                description: 'This food has a fair nutritional balance.'
            };
        } else if (score >= 50) {
            return {
                rating: 'Moderate',
                description: 'This food has a moderate nutritional balance.'
            };
        } else if (score >= 40) {
            return {
                rating: 'Poor',
                description: 'This food has a poor nutritional balance.'
            };
        } else if (score >= 30) {
            return {
                rating: 'Very Poor',
                description: 'This food has a very poor nutritional balance.'
            };
        } else {
            return {
                rating: 'Unsuitable',
                description: 'This food has an unsuitable nutritional balance.'
            };
        }
    }

    /**
     * Get detailed nutrition comparisons between food and target
     * @param {Object} foodNutrition - Food nutrition values
     * @param {Object} targetNutrition - Target nutrition values
     * @returns {Object} Detailed nutrition comparisons
     */
    static getNutritionComparisons(foodNutrition, targetNutrition) {
        try {
            // Extract nutrition values from food
            const foodCalories = foodNutrition.total_calorie || 0;
            const foodProtein = foodNutrition.total_protein || 0;
            const foodFat = foodNutrition.total_fat || 0;
            const foodCarb = foodNutrition.total_carb || 0;
            const foodFiber = foodNutrition.total_fiber || 0;

            // Extract target nutrition values
            const targetCalories = targetNutrition.daily.calories || 2000;
            const targetProtein = targetNutrition.daily.protein || 50;
            const targetFat = targetNutrition.daily.fat || 70;
            const targetCarb = targetNutrition.daily.carbs || 250;
            const targetFiber = targetNutrition.daily.fiber || 25;

            // Calculate total macronutrients in grams
            const totalFoodGrams = foodProtein + foodFat + foodCarb + foodFiber;
            const totalTargetGrams = targetProtein + targetFat + targetCarb + targetFiber;

            // Calculate nutrient ratios (percentage of total macros)
            const foodRatios = {
                protein: totalFoodGrams > 0 ? (foodProtein / totalFoodGrams) * 100 : 0,
                fat: totalFoodGrams > 0 ? (foodFat / totalFoodGrams) * 100 : 0,
                carbs: totalFoodGrams > 0 ? (foodCarb / totalFoodGrams) * 100 : 0,
                fiber: totalFoodGrams > 0 ? (foodFiber / totalFoodGrams) * 100 : 0
            };

            const targetRatios = {
                protein: totalTargetGrams > 0 ? (targetProtein / totalTargetGrams) * 100 : 0,
                fat: totalTargetGrams > 0 ? (targetFat / totalTargetGrams) * 100 : 0,
                carbs: totalTargetGrams > 0 ? (targetCarb / totalTargetGrams) * 100 : 0,
                fiber: totalTargetGrams > 0 ? (targetFiber / totalTargetGrams) * 100 : 0
            };

            // Calculate percentage of each nutrient compared to target (for traditional view)
            const caloriesPercentage = (foodCalories / targetCalories) * 100;
            const proteinPercentage = (foodProtein / targetProtein) * 100;
            const fatPercentage = (foodFat / targetFat) * 100;
            const carbPercentage = (foodCarb / targetCarb) * 100;
            const fiberPercentage = (foodFiber / targetFiber) * 100;

            // Calculate absolute ratio differences
            const proteinRatioDiff = Math.abs(foodRatios.protein - targetRatios.protein);
            const fatRatioDiff = Math.abs(foodRatios.fat - targetRatios.fat);
            const carbsRatioDiff = Math.abs(foodRatios.carbs - targetRatios.carbs);
            const fiberRatioDiff = Math.abs(foodRatios.fiber - targetRatios.fiber);

            return {
                calories: {
                    food: foodCalories,
                    target: targetCalories,
                    percentage: Math.round(caloriesPercentage),
                    deviation: Math.round(Math.abs(caloriesPercentage - 100))
                },
                protein: {
                    food: foodProtein,
                    target: targetProtein,
                    percentage: Math.round(proteinPercentage),
                    deviation: Math.round(Math.abs(proteinPercentage - 100)),
                    foodRatio: Math.round(foodRatios.protein),
                    targetRatio: Math.round(targetRatios.protein),
                    ratioDifference: Math.round(proteinRatioDiff)
                },
                fat: {
                    food: foodFat,
                    target: targetFat,
                    percentage: Math.round(fatPercentage),
                    deviation: Math.round(Math.abs(fatPercentage - 100)),
                    foodRatio: Math.round(foodRatios.fat),
                    targetRatio: Math.round(targetRatios.fat),
                    ratioDifference: Math.round(fatRatioDiff)
                },
                carbs: {
                    food: foodCarb,
                    target: targetCarb,
                    percentage: Math.round(carbPercentage),
                    deviation: Math.round(Math.abs(carbPercentage - 100)),
                    foodRatio: Math.round(foodRatios.carbs),
                    targetRatio: Math.round(targetRatios.carbs),
                    ratioDifference: Math.round(carbsRatioDiff)
                },
                fiber: {
                    food: foodFiber,
                    target: targetFiber,
                    percentage: Math.round(fiberPercentage),
                    deviation: Math.round(Math.abs(fiberPercentage - 100)),
                    foodRatio: Math.round(foodRatios.fiber),
                    targetRatio: Math.round(targetRatios.fiber),
                    ratioDifference: Math.round(fiberRatioDiff)
                },
                nutritionalBalance: {
                    avgRatioDifference: Math.round((proteinRatioDiff + fatRatioDiff + carbsRatioDiff + fiberRatioDiff) / 4 * 100) / 100,
                    totalFoodGrams: totalFoodGrams,
                    totalTargetGrams: totalTargetGrams
                }
            };
        } catch (error) {
            console.error('Error calculating nutrition comparisons:', error);
            return {
                calories: { food: 0, target: 0, percentage: 0, deviation: 0 },
                protein: { food: 0, target: 0, percentage: 0, deviation: 0, foodRatio: 0, targetRatio: 0, ratioDifference: 0 },
                fat: { food: 0, target: 0, percentage: 0, deviation: 0, foodRatio: 0, targetRatio: 0, ratioDifference: 0 },
                carbs: { food: 0, target: 0, percentage: 0, deviation: 0, foodRatio: 0, targetRatio: 0, ratioDifference: 0 },
                fiber: { food: 0, target: 0, percentage: 0, deviation: 0, foodRatio: 0, targetRatio: 0, ratioDifference: 0 },
                nutritionalBalance: { avgRatioDifference: 0, totalFoodGrams: 0, totalTargetGrams: 0 }
            };
        }
    }
}

module.exports = NutritionScoreCalculator;
