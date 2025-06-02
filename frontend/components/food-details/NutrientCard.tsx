import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Food, NutritionScore } from '@/types/food';
import { TargetNutrition } from '@/types/targetNutrition';

interface NutritionComment {
    nutrition_type: string;
    nutrition_comment: string;
    icon?: string;
    nutrition_delta: number;
}

interface NutrientCardProps {
    nutrient: NutritionComment;
    nutritionScore?: NutritionScore;
    food?: Food;
    targetNutrition?: TargetNutrition | null;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export const NutrientCard: React.FC<NutrientCardProps> = ({ nutrient, nutritionScore, food, targetNutrition, mealType }) => {
    // Define colors for each nutrition type
    const getNutritionTypeColor = (type: string) => {
        // Convert to lowercase for case-insensitive comparison
        const typeLower = type.toLowerCase();

        if (typeLower.includes('calorie')) {
            return '#FF6B6B'; // Red for calories
        } else if (typeLower.includes('carb')) {
            return '#FFD166'; // Yellow for carbs
        } else if (typeLower.includes('protein')) {
            return '#118AB2'; // Blue for protein
        } else if (typeLower.includes('fat')) {
            return '#06D6A0'; // Green for fat
        } else if (typeLower.includes('fiber')) {
            return '#8BC34A'; // Original color for fiber
        } else {
            return nutrient.nutrition_delta >= 0 ? '#47b255' : '#FF6B6B';
        }
    };

    const barColor = getNutritionTypeColor(nutrient.nutrition_type);
    const typeLower = nutrient.nutrition_type.toLowerCase();

    // Get target and food values for the nutrition
    const getNutritionValues = () => {
        let foodValue = 0;
        let targetValue = 0;

        // Set food value from the food object if available
        if (food) {
            if (typeLower.includes('calorie')) {
                foodValue = food.total_calorie || 0;
            } else if (typeLower.includes('carb')) {
                foodValue = food.total_carb || 0;
            } else if (typeLower.includes('protein')) {
                foodValue = food.total_protein || 0;
            } else if (typeLower.includes('fat')) {
                foodValue = food.total_fat || 0;
            } else if (typeLower.includes('fiber')) {
                foodValue = food.total_fiber || 0;
            }
        }

        const getMealTarget = (target: number): number => {
            if (!mealType || !target) return target;

            const mealDistribution = {
                breakfast: 0.25,
                lunch: 0.35,
                dinner: 0.30,
                snack: 0.10
            };

            return target * mealDistribution[mealType];
        };

        // First try to get target value from targetNutrition if available
        if (targetNutrition?.daily) {
            if (typeLower.includes('calorie')) {
                targetValue = getMealTarget(targetNutrition.daily.calories || 0);
            } else if (typeLower.includes('carb')) {
                targetValue = getMealTarget(targetNutrition.daily.carbs || 0);
            } else if (typeLower.includes('protein')) {
                targetValue = getMealTarget(targetNutrition.daily.protein || 0);
            } else if (typeLower.includes('fat')) {
                targetValue = getMealTarget(targetNutrition.daily.fat || 0);
            } else if (typeLower.includes('fiber')) {
                targetValue = getMealTarget(targetNutrition.daily.fiber || 0);
            }
        }
        // Fallback to values from nutritionScore.score_details.comparisons
        else if (nutritionScore?.score_details?.comparisons) {
            const comparisons = nutritionScore.score_details.comparisons;

            if (typeLower.includes('calorie')) {
                if (foodValue === 0) foodValue = comparisons.calories.food;
                targetValue = comparisons.calories.target;
            } else if (typeLower.includes('carb')) {
                if (foodValue === 0) foodValue = comparisons.carbs.food;
                targetValue = comparisons.carbs.target;
            } else if (typeLower.includes('protein')) {
                if (foodValue === 0) foodValue = comparisons.protein.food;
                targetValue = comparisons.protein.target;
            } else if (typeLower.includes('fat')) {
                if (foodValue === 0) foodValue = comparisons.fat.food;
                targetValue = comparisons.fat.target;
            } else if (typeLower.includes('fiber')) {
                if (foodValue === 0) foodValue = comparisons.fiber.food;
                targetValue = comparisons.fiber.target;
            }
        } else {
            console.log('No target nutrition data available for', nutrient.nutrition_type);
        }

        return { foodValue, targetValue };
    };

    const { foodValue, targetValue } = getNutritionValues();

    // Calculate percentage relative to target (target is 100%)
    // If foodValue > targetValue, progressPercentage > 100%
    // If foodValue < targetValue, progressPercentage < 100%
    const percentage = targetValue > 0 ? (foodValue / targetValue) * 100 : 0;
    const progressPercentage = Math.min(Math.max(percentage, 0), 200); // Limit to 0-200% range

    // Map nutrition types to appropriate Ionicons
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
        Protein: 'barbell',
        Fat: 'water',
        Carb: 'nutrition',
        Fiber: 'leaf',
        Calorie: 'flame'
    };

    const iconName = iconMap[nutrient.nutrition_type] || 'information-circle';

    // Get nutritional value in grams if available
    const getNutritionalValue = () => {
        // If we have the direct food object, use that first
        if (food) {
            if (typeLower.includes('calorie')) {
                return `${Math.round(food.total_calorie)} kcal`;
            } else if (typeLower.includes('carb')) {
                return `${Math.round(food.total_carb)} g`;
            } else if (typeLower.includes('protein')) {
                return `${Math.round(food.total_protein)} g`;
            } else if (typeLower.includes('fat')) {
                return `${Math.round(food.total_fat)} g`;
            } else if (typeLower.includes('fiber')) {
                return `${Math.round(food.total_fiber)} g`;
            }
        }

        // Fallback to nutrition score if we have it
        if (nutritionScore?.score_details?.comparisons) {
            const comparisons = nutritionScore.score_details.comparisons;

            if (typeLower.includes('calorie')) {
                return `${Math.round(comparisons.calories.food)} kcal`;
            } else if (typeLower.includes('carb')) {
                return `${Math.round(comparisons.carbs.food)} g`;
            } else if (typeLower.includes('protein')) {
                return `${Math.round(comparisons.protein.food)} g`;
            } else if (typeLower.includes('fat')) {
                return `${Math.round(comparisons.fat.food)} g`;
            } else if (typeLower.includes('fiber')) {
                return `${Math.round(comparisons.fiber.food)} g`;
            }
        }

        // Last resort fallback
        const value = Math.abs(nutrient.nutrition_delta);

        if (typeLower.includes('calorie')) {
            return `${value} kcal`;
        } else {
            return `${value} g`;
        }
    };

    const nutritionalValue = getNutritionalValue();

    // Format comment text to improve readability
    const formatComment = (comment: string) => {
        let formatted = comment.trim();
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
        if (!formatted.endsWith('.')) {
            formatted += '.';
        }
        return formatted;
    };

    return (
        <View style={styles.cardContainer}>
            <View style={styles.headerRow}>
                <Ionicons name={iconName} size={24} color={barColor} />
                <ThemedText type="defaultSemiBold" style={styles.nutritionType}>
                    {nutrient.nutrition_type}
                </ThemedText>
            </View>

            <View style={styles.nutritionValuesRow}>
                <View style={styles.valueContainer}>
                    <ThemedText style={styles.valueLabel}>Food</ThemedText>
                    <ThemedText style={[styles.nutritionValueText, { color: foodValue > targetValue ? '#FF6B6B' : barColor }]}>
                        {Math.round(foodValue)}{typeLower.includes('calorie') ? ' kcal' : ' g'}
                    </ThemedText>
                </View>
                <View style={styles.valueContainer}>
                    <ThemedText style={styles.valueLabel}>Target</ThemedText>
                    <ThemedText style={styles.nutritionValueText}>
                        {Math.round(targetValue)}{typeLower.includes('calorie') ? ' kcal' : ' g'}
                    </ThemedText>
                </View>
            </View>

            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { height: 20 }]}>
                    {/* Background bar */}
                    <View style={[
                        styles.progressBarBackground,
                        {
                            backgroundColor: '#EAEAEA',
                            opacity: 0.3
                        }
                    ]} />

                    {/* Target marker line (centered) */}
                    <View style={[
                        styles.targetMarker,
                        {
                            left: '50%',
                            height: 26,
                            top: -3
                        }
                    ]} />

                    {/* Food value bar */}
                    <View style={[
                        styles.progressBarFill,
                        {
                            width: `${Math.min(percentage / 2, 50)}%`,
                            backgroundColor: barColor,
                            left: percentage <= 100 ? '50%' : undefined,
                            transform: [{ translateX: percentage <= 100 ? -1 : 0 }]
                        }
                    ]} />

                    {/* Excess bar (if food > target) */}
                    {percentage > 100 && (
                        <View style={[
                            styles.progressBarExcess,
                            {
                                left: '50%',
                                width: `${Math.min((percentage - 100) / 2, 50)}%`,
                                backgroundColor: '#FF6B6B',
                                opacity: 0.5
                            }
                        ]} />
                    )}

                    {/* Deficit bar (if food < target) */}
                    {percentage < 100 && (
                        <View style={[
                            styles.progressBarDeficit,
                            {
                                right: '50%',
                                width: `${Math.min((100 - percentage) / 2, 50)}%`,
                                backgroundColor: '#EAEAEA',
                                opacity: 0.5
                            }
                        ]} />
                    )}
                </View>

                {/* Percentage text */}
                <View style={styles.percentageRow}>
                    <ThemedText style={[
                        styles.percentageText,
                        {
                            color: percentage > 100 ? '#FF6B6B' :
                                percentage < 50 ? '#FF9800' :
                                    '#47b255'
                        }
                    ]}>
                        {Math.round(percentage)}% of target
                    </ThemedText>
                </View>
            </View>

            <ThemedText style={styles.commentText}>
                {formatComment(nutrient.nutrition_comment)}
            </ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 16,
        margin: 12,
        marginTop: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    nutritionType: {
        fontSize: 18,
        marginStart: 10,
        color: '#333',
    },
    progressBarContainer: {
        marginVertical: 8,
    },
    progressBar: {
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    progressBarBackground: {
        position: 'absolute',
        start: 0,
        end: 0,
        top: 0,
        bottom: 0,
    },
    progressBarFill: {
        position: 'absolute',
        start: 0,
        top: 0,
        bottom: 0,
    },
    progressBarExcess: {
        position: 'absolute',
        top: 0,
        bottom: 0,
    },
    progressBarDeficit: {
        position: 'absolute',
        top: 0,
        bottom: 0,
    },
    targetMarker: {
        position: 'absolute',
        width: 2,
        backgroundColor: '#000',
        opacity: 0.2,
        zIndex: 2,
    },
    nutritionValuesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    valueContainer: {
        alignItems: 'center',
    },
    valueLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    nutritionValueText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    percentageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    percentageText: {
        fontSize: 12,
        fontWeight: '600',
    }, commentText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#444',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
});
