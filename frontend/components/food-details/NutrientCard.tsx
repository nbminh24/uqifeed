import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
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

// Type for our component's styles
type Styles = {
    cardContainer: ViewStyle;
    headerRow: ViewStyle;
    titleContainer: ViewStyle;
    valuesContainer: ViewStyle;
    separator: ViewStyle;
    progressBarContainer: ViewStyle;
    progressBar: ViewStyle;
    progressBarFill: ViewStyle;
    percentageLabel: TextStyle;
    nutritionType: TextStyle;
    valueContainer: ViewStyle;
    valueLabel: TextStyle;
    nutritionValueText: TextStyle;
    commentText: TextStyle;
    percentageRow: ViewStyle;
    percentageText: TextStyle;
};

export const NutrientCard: React.FC<NutrientCardProps> = ({ nutrient, nutritionScore, food, targetNutrition, mealType }) => {
    // Get color based on percentage difference from target
    const getPercentageColor = (percentage: number): string => {
        const diff = Math.abs(100 - percentage);
        if (diff > 30) return '#FF6B6B'; // Red for >30% difference
        if (diff > 20) return '#FFD166'; // Yellow for >20% difference
        return '#47b255'; // Green for ≤20% difference
    };

    const typeLower = nutrient.nutrition_type.toLowerCase();

    // Get target and food values for the nutrition
    const getNutritionValues = () => {
        let foodValue = 0;
        let targetValue = 0;

        // Set food value from the food object if available
        if (food) {
            // Map nutrition types to corresponding food object properties
            const propertyMap: { [key: string]: keyof Food } = {
                protein: 'total_protein',
                proteins: 'total_protein',
                fat: 'total_fat',
                fats: 'total_fat',
                carb: 'total_carb',
                carbs: 'total_carb',
                fiber: 'total_fiber',
                calorie: 'total_calorie',
                calories: 'total_calorie'
            };

            const propertyKey = propertyMap[typeLower];
            if (propertyKey && propertyKey in food) {
                const value = food[propertyKey];
                // Ensure we have a valid number
                if (value !== null && value !== undefined) {
                    foodValue = typeof value === 'number' ? value : parseFloat(value as string);
                    // If parsing resulted in NaN, use 0 as a fallback
                    if (isNaN(foodValue)) foodValue = 0;
                }
            }
        }

        // Get meal-specific target value
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
            // Map nutrition types to corresponding target nutrition properties
            const targetMap: { [key: string]: keyof typeof targetNutrition.daily } = {
                protein: 'protein',
                proteins: 'protein',
                fat: 'fat',
                fats: 'fat',
                carb: 'carbs',
                carbs: 'carbs',
                fiber: 'fiber',
                calorie: 'calories',
                calories: 'calories'
            };
            const targetKey = targetMap[typeLower];
            if (targetKey) {
                const rawTargetValue = targetNutrition.daily[targetKey];
                if (rawTargetValue !== null && rawTargetValue !== undefined) {
                    targetValue = getMealTarget(rawTargetValue);
                    // If the result is NaN, use fallback value
                    if (isNaN(targetValue)) targetValue = 0;
                }
            }
        }
        // Fallback to values from nutritionScore.score_details.comparisons
        else if (nutritionScore?.score_details?.comparisons) {
            const comparisons = nutritionScore.score_details.comparisons;
            // Map nutrition types to corresponding comparison properties
            const comparisonMap: { [key: string]: keyof typeof comparisons } = {
                protein: 'protein',
                proteins: 'protein',
                fat: 'fat',
                fats: 'fat',
                carb: 'carbs',
                carbs: 'carbs',
                fiber: 'fiber',
                calorie: 'calories',
                calories: 'calories'
            };
            const comparisonKey = comparisonMap[typeLower];
            if (comparisonKey && comparisonKey in comparisons) {
                if (foodValue === 0) {
                    foodValue = comparisons[comparisonKey].food;
                }
                targetValue = comparisons[comparisonKey].target;
            }
        } else {
            console.log('No target nutrition data available for', nutrient.nutrition_type);
        }

        return { foodValue, targetValue };
    };

    // Get values and ensure they're not null/undefined/NaN
    const { foodValue: rawFoodValue, targetValue: rawTargetValue } = getNutritionValues();
    const foodValue = isNaN(rawFoodValue) || rawFoodValue === null || rawFoodValue === undefined ? 0 : rawFoodValue;
    const targetValue = isNaN(rawTargetValue) || rawTargetValue === null || rawTargetValue === undefined ? 1 : rawTargetValue;    // Calculate percentage relative to target (target is 100%)
    const percentage = targetValue > 0 ? (foodValue / targetValue) * 100 : 0;
    // Calculate width for progress bar (50% of full width = 100% of target)
    const progressWidth = (percentage / 2);
    const barColor = getPercentageColor(percentage);

    // Map nutrition types to appropriate Ionicons
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
        protein: 'barbell',
        fat: 'water',
        carb: 'nutrition',
        carbs: 'nutrition',
        fiber: 'leaf',
        calorie: 'flame',
        calories: 'flame'
    };

    const iconName = iconMap[typeLower] || 'information-circle';

    // Get nutritional value in grams if available
    const getNutritionalValue = () => {
        // If we have the direct food object, use that first
        if (food) {
            try {
                if (typeLower === 'calories' || typeLower === 'calorie') {
                    return `${Math.round(food.total_calorie || 0)} kcal`;
                } else if (typeLower === 'carbs' || typeLower === 'carb') {
                    return `${Math.round(food.total_carb || 0)} g`;
                } else if (typeLower === 'protein') {
                    return `${Math.round(food.total_protein || 0)} g`;
                } else if (typeLower === 'fat') {
                    return `${Math.round(food.total_fat || 0)} g`;
                } else if (typeLower === 'fiber') {
                    return `${Math.round(food.total_fiber || 0)} g`;
                }
            } catch (error) {
                console.error(`[NutrientCard] Error getting food value for ${typeLower}:`, error);
                // Fall through to next method
            }
        }

        // Fallback to nutrition score if we have it
        if (nutritionScore?.score_details?.comparisons) {
            try {
                const comparisons = nutritionScore.score_details.comparisons;

                if (typeLower === 'calories' || typeLower === 'calorie') {
                    return `${Math.round(comparisons.calories?.food || 0)} kcal`;
                } else if (typeLower === 'carbs' || typeLower === 'carb') {
                    return `${Math.round(comparisons.carbs?.food || 0)} g`;
                } else if (typeLower === 'protein') {
                    return `${Math.round(comparisons.protein?.food || 0)} g`;
                } else if (typeLower === 'fat') {
                    return `${Math.round(comparisons.fat?.food || 0)} g`;
                } else if (typeLower === 'fiber') {
                    return `${Math.round(comparisons.fiber?.food || 0)} g`;
                }
            } catch (error) {
                console.error(`[NutrientCard] Error getting nutrition score value for ${typeLower}:`, error);
                // Fall through to next method
            }
        }

        // Last resort fallback
        const value = Math.abs(nutrient.nutrition_delta);

        if (typeLower === 'calories' || typeLower === 'calorie') {
            return `${value} kcal`;
        } else {
            return `${value} g`;
        }
    };

    // Format nutrition comment
    const formatComment = (comment: string): string => comment.replace(/\.$/, ''); // Remove trailing period

    return (
        <View style={styles.cardContainer}>
            <View>
                <View style={styles.headerRow}>
                    <View style={styles.titleContainer}>
                        <Ionicons name={iconName} size={24} color={barColor} />
                        <ThemedText style={styles.nutritionType}>{nutrient.nutrition_type}</ThemedText>
                    </View>
                    <View style={styles.valuesContainer}>
                        <View style={styles.valueContainer}>
                            <ThemedText style={styles.valueLabel}>Total</ThemedText>
                            <ThemedText style={styles.nutritionValueText}>
                                {getNutritionalValue()}
                            </ThemedText>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.valueContainer}>
                            <ThemedText style={styles.valueLabel}>Target</ThemedText>
                            <ThemedText style={styles.nutritionValueText}>
                                {targetValue > 0 ? (
                                    typeLower.includes('calorie') ?
                                        `${Math.round(targetValue)} kcal` :
                                        `${Math.round(targetValue)} g`
                                ) : '-'}
                            </ThemedText>
                        </View>
                    </View>
                </View>                {/* Progress Bar Container */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                        <View style={styles.targetLine} />
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${progressWidth}%`,
                                    backgroundColor: barColor
                                }
                            ]}
                        />
                    </View>
                </View>

                <View style={styles.percentageRow}>
                    <ThemedText style={[
                        styles.percentageText,
                        { color: barColor }
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

// Define styles for the component
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valuesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    separator: {
        width: 1,
        height: 24,
        backgroundColor: '#E0E0E0',
    },
    progressBarContainer: {
        marginVertical: 8,
    }, progressBar: {
        height: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
    },
    progressBarFill: {
        height: '100%',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        position: 'absolute',
        left: 0,
    },
    targetLine: {
        position: 'absolute',
        width: 1,
        height: '100%',
        backgroundColor: '#E0E0E0',
        left: '50%',
        zIndex: 1,
    },
    valueContainer: {
        alignItems: 'center',
    },
    valueLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    nutritionType: {
        fontSize: 18,
        marginLeft: 10,
        color: '#333',
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
    },
    commentText: {
        fontSize: 14,
        color: '#444',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
});

