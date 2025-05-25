/**
 * Nutrition Comment Service
 * Generates nutrition comments based on the percentage difference between food nutrition and target nutrition for specific meal types
 */
class NutritionCommentService {
    /**
     * Generate comments for all nutrition types based on food and target nutrition for a specific meal type
     * @param {Object} foodNutrition - Food nutrition values
     * @param {Object} targetNutrition - Target nutrition values
     * @param {String} mealType - Meal type (breakfast, lunch, dinner, snack)
     * @returns {Object} Comments for each nutrition type
     */
    static generateAllComments(foodNutrition, targetNutrition, mealType) {
        // Extract nutrition values from food
        const foodCalories = foodNutrition.total_calorie || 0;
        const foodProtein = foodNutrition.total_protein || 0;
        const foodFat = foodNutrition.total_fat || 0;
        const foodCarb = foodNutrition.total_carb || 0;
        const foodFiber = foodNutrition.total_fiber || 0;

        // Get the appropriate meal target based on meal type
        const mealTarget = this.getMealTargetNutrition(targetNutrition, mealType);

        // Extract target nutrition values for the specific meal
        const targetCalories = mealTarget.calories || 0;
        const targetProtein = mealTarget.protein || 0;
        const targetFat = mealTarget.fat || 0;
        const targetCarb = mealTarget.carbs || 0;
        const targetFiber = mealTarget.fiber || 0;

        // Calculate percentage for each nutrition type
        const proteinPercentage = targetProtein > 0 ? (foodProtein / targetProtein) * 100 : 0;
        const fatPercentage = targetFat > 0 ? (foodFat / targetFat) * 100 : 0;
        const carbPercentage = targetCarb > 0 ? (foodCarb / targetCarb) * 100 : 0;
        const fiberPercentage = targetFiber > 0 ? (foodFiber / targetFiber) * 100 : 0;
        const caloriesPercentage = targetCalories > 0 ? (foodCalories / targetCalories) * 100 : 0;

        // Generate comments for each nutrition type
        const proteinComment = this.getProteinComment(proteinPercentage);
        const fatComment = this.getFatComment(fatPercentage);
        const carbComment = this.getCarbComment(carbPercentage);
        const fiberComment = this.getFiberComment(fiberPercentage);
        const caloriesComment = this.getCaloriesComment(caloriesPercentage);

        return {
            protein: {
                type: 'Protein',
                percentage: Math.round(proteinPercentage),
                comment: proteinComment,
                icon: '🥩'
            },
            fat: {
                type: 'Fat',
                percentage: Math.round(fatPercentage),
                comment: fatComment,
                icon: '🥑'
            },
            carbs: {
                type: 'Carbohydrate',
                percentage: Math.round(carbPercentage),
                comment: carbComment,
                icon: '🍚'
            },
            fiber: {
                type: 'Fiber',
                percentage: Math.round(fiberPercentage),
                comment: fiberComment,
                icon: '🥦'
            },
            calories: {
                type: 'Calories',
                percentage: Math.round(caloriesPercentage),
                comment: caloriesComment,
                icon: '🔥'
            }
        };
    }

    /**
     * Get comment for protein based on percentage
     * @param {Number} percentage - Percentage of protein compared to target
     * @returns {String} Comment
     */
    static getProteinComment(percentage) {
        if (percentage < 70) {
            return 'Nên bổ sung thêm đạm từ thịt, trứng, đậu hoặc sữa để hỗ trợ duy trì cơ và miễn dịch.';
        } else if (percentage >= 70 && percentage < 90) {
            return 'Cần tăng nhẹ lượng protein, nhất là nếu có tập luyện hoặc cần duy trì khối cơ.';
        } else if (percentage >= 90 && percentage < 110) {
            return 'Lượng protein phù hợp với nhu cầu, hỗ trợ tốt cho sức khỏe và phục hồi.';
        } else if (percentage >= 110 && percentage < 130) {
            return 'Có thể giảm nhẹ nếu không tập luyện nhiều, ưu tiên đạm từ cá hoặc đậu.';
        } else {
            return 'Nên điều chỉnh lượng đạm nếu sử dụng lâu dài, tránh gây áp lực lên thận.';
        }
    }

    /**
     * Get comment for fat based on percentage
     * @param {Number} percentage - Percentage of fat compared to target
     * @returns {String} Comment
     */
    static getFatComment(percentage) {
        if (percentage < 70) {
            return 'Nên bổ sung chất béo lành mạnh từ dầu olive, cá béo, bơ hoặc hạt để hỗ trợ hấp thu vitamin.';
        } else if (percentage >= 70 && percentage < 90) {
            return 'Có thể thêm chút chất béo tốt để cân bằng năng lượng và nội tiết.';
        } else if (percentage >= 90 && percentage < 110) {
            return 'Lượng chất béo hợp lý, hỗ trợ tốt cho năng lượng dài hạn và trao đổi chất.';
        } else if (percentage >= 110 && percentage < 130) {
            return 'Nên chọn chất béo không bão hòa, hạn chế đồ chiên và mỡ động vật.';
        } else {
            return 'Cần giảm lượng chất béo tổng thể để hỗ trợ kiểm soát cân nặng và mỡ máu.';
        }
    }

    /**
     * Get comment for carbs based on percentage
     * @param {Number} percentage - Percentage of carbs compared to target
     * @returns {String} Comment
     */
    static getCarbComment(percentage) {
        if (percentage < 70) {
            return 'Nên bổ sung carb từ ngũ cốc nguyên hạt, trái cây hoặc khoai để đảm bảo năng lượng.';
        } else if (percentage >= 70 && percentage < 90) {
            return 'Cần tăng nhẹ lượng carb phức hợp để cải thiện hiệu suất và tập trung.';
        } else if (percentage >= 90 && percentage < 110) {
            return 'Carb cân đối, cung cấp năng lượng ổn định cho cơ thể.';
        } else if (percentage >= 110 && percentage < 130) {
            return 'Có thể giảm nhẹ nếu ít vận động, ưu tiên carb có chỉ số đường huyết thấp.';
        } else {
            return 'Nên hạn chế tinh bột tinh chế và tăng cường vận động nếu cần.';
        }
    }

    /**
     * Get comment for fiber based on percentage
     * @param {Number} percentage - Percentage of fiber compared to target
     * @returns {String} Comment
     */
    static getFiberComment(percentage) {
        if (percentage < 70) {
            return 'Nên tăng cường rau, trái cây và ngũ cốc nguyên hạt để hỗ trợ tiêu hóa và kiểm soát đường huyết.';
        } else if (percentage >= 70 && percentage < 90) {
            return 'Có thể thêm rau hoặc trái cây trong khẩu phần để cải thiện sức khỏe đường ruột.';
        } else if (percentage >= 90 && percentage < 110) {
            return 'Chất xơ đạt mức tốt, giúp tiêu hóa và tạo cảm giác no tự nhiên.';
        } else if (percentage >= 110 && percentage < 130) {
            return 'Nên uống đủ nước nếu lượng chất xơ cao để tránh đầy hơi.';
        } else {
            return 'Cần giảm nhẹ chất xơ nếu gặp khó chịu tiêu hóa, kết hợp với nước đầy đủ.';
        }
    }

    /**
     * Get comment for calories based on percentage
     * @param {Number} percentage - Percentage of calories compared to target
     * @returns {String} Comment
     */
    static getCaloriesComment(percentage) {
        if (percentage < 70) {
            return 'Nên tăng năng lượng nạp vào để tránh thiếu hụt dinh dưỡng và giảm trao đổi chất.';
        } else if (percentage >= 70 && percentage < 90) {
            return 'Cần tăng nhẹ khẩu phần nếu không trong chế độ giảm cân.';
        } else if (percentage >= 90 && percentage < 110) {
            return 'Mức calo hợp lý, hỗ trợ duy trì cân nặng và năng lượng ổn định.';
        } else if (percentage >= 110 && percentage < 130) {
            return 'Có thể điều chỉnh khẩu phần nếu không hoạt động nhiều, tránh tích mỡ.';
        } else {
            return 'Nên giảm năng lượng nạp vào hoặc tăng cường vận động để cân đối.';
        }
    }

    /**
     * Get meal-specific target nutrition
     * @param {Object} targetNutrition - Target nutrition values
     * @param {String} mealType - Meal type (breakfast, lunch, dinner, snack)
     * @returns {Object} Meal-specific target nutrition
     */
    static getMealTargetNutrition(targetNutrition, mealType) {
        if (!targetNutrition || !targetNutrition.meals) {
            // Fallback values if target nutrition is not available
            return {
                calories: 500,
                protein: 25,
                fat: 17,
                carbs: 60,
                fiber: 7
            };
        }

        // Get meal-specific target or fallback to default proportions if not found
        switch (mealType) {
            case 'breakfast':
                return targetNutrition.meals.breakfast || {
                    calories: targetNutrition.daily.calories * 0.3,
                    protein: targetNutrition.daily.protein * 0.3,
                    fat: targetNutrition.daily.fat * 0.3,
                    carbs: targetNutrition.daily.carbs * 0.3,
                    fiber: targetNutrition.daily.fiber * 0.3
                };
            case 'lunch':
                return targetNutrition.meals.lunch || {
                    calories: targetNutrition.daily.calories * 0.35,
                    protein: targetNutrition.daily.protein * 0.35,
                    fat: targetNutrition.daily.fat * 0.35,
                    carbs: targetNutrition.daily.carbs * 0.35,
                    fiber: targetNutrition.daily.fiber * 0.35
                };
            case 'dinner':
                return targetNutrition.meals.dinner || {
                    calories: targetNutrition.daily.calories * 0.25,
                    protein: targetNutrition.daily.protein * 0.25,
                    fat: targetNutrition.daily.fat * 0.25,
                    carbs: targetNutrition.daily.carbs * 0.25,
                    fiber: targetNutrition.daily.fiber * 0.25
                };
            case 'snack':
                return targetNutrition.meals.snack || {
                    calories: targetNutrition.daily.calories * 0.1,
                    protein: targetNutrition.daily.protein * 0.1,
                    fat: targetNutrition.daily.fat * 0.1,
                    carbs: targetNutrition.daily.carbs * 0.1,
                    fiber: targetNutrition.daily.fiber * 0.1
                };
            default:
                // If no meal type specified, use 25% of daily values as default
                return {
                    calories: targetNutrition.daily.calories * 0.25,
                    protein: targetNutrition.daily.protein * 0.25,
                    fat: targetNutrition.daily.fat * 0.25,
                    carbs: targetNutrition.daily.carbs * 0.25,
                    fiber: targetNutrition.daily.fiber * 0.25
                };
        }
    }
}

module.exports = NutritionCommentService;
