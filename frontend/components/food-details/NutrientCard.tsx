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
    centerMarker: ViewStyle;
    barBackground: ViewStyle;
    progressBarFill: ViewStyle;
    progressNormal: ViewStyle;
    progressExcess: ViewStyle;
    percentageLabel: TextStyle;
    nutritionType: TextStyle;
    valueContainer: ViewStyle;
    valueLabel: TextStyle;
    nutritionValueText: TextStyle;
    commentText: TextStyle;
};

export const NutrientCard: React.FC<NutrientCardProps> = ({ nutrient, nutritionScore, food, targetNutrition, mealType }) => {
    // Define colors for each nutrition type
    const getNutritionTypeColor = (type: string) => {
        // Convert to lowercase for case-insensitive comparison
        const typeLower = type.toLowerCase();

        if (typeLower === 'calorie' || typeLower === 'calories') {
            return '#FF6B6B'; // Red for calories
        } else if (typeLower === 'carb' || typeLower === 'carbs') {
            return '#FFD166'; // Yellow for carbs
        } else if (typeLower === 'protein') {
            return '#118AB2'; // Blue for protein
        } else if (typeLower === 'fat') {
            return '#06D6A0'; // Green for fat
        } else if (typeLower === 'fiber') {
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

        const getMealTarget = (target: number): number => {
            if (!mealType || !target) return target;

            const mealDistribution = {
                breakfast: 0.25,
                lunch: 0.35,
                dinner: 0.30,
                snack: 0.10
            };

            return target * mealDistribution[mealType];
        };        // First try to get target value from targetNutrition if available
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
            }; const targetKey = targetMap[typeLower];
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
            }; const comparisonKey = comparisonMap[typeLower];
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
    };    // Get values and ensure they're not null/undefined/NaN
    const { foodValue: rawFoodValue, targetValue: rawTargetValue } = getNutritionValues();
    const foodValue = isNaN(rawFoodValue) || rawFoodValue === null || rawFoodValue === undefined ? 0 : rawFoodValue;
    const targetValue = isNaN(rawTargetValue) || rawTargetValue === null || rawTargetValue === undefined ? 1 : rawTargetValue; // Use 1 as fallback to avoid division by zero

    // Calculate percentage relative to target (target is 100%)
    // If foodValue > targetValue, progressPercentage > 100%
    // If foodValue < targetValue, progressPercentage < 100%
    const percentage = targetValue > 0 ? (foodValue / targetValue) * 100 : 0;
    const progressPercentage = Math.min(Math.max(percentage, 0), 200); // Limit to 0-200% range// Map nutrition types to appropriate Ionicons
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
        }        // Fallback to nutrition score if we have it
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

    const getProgressColor = (percentage: number) => {
        const diff = Math.abs(percentage - 100);
        if (diff > 30) return '#FF6B6B'; // Red for >30% difference
        if (diff > 20) return '#FFD166'; // Yellow for >20% difference
        return '#47b255'; // Green for <=20% difference
    };

    return (
        <View style={styles.cardContainer}>
            <View style={styles.headerRow}>
                <View style={styles.titleContainer}>
                    <Ionicons name={iconName} size={24} color={barColor} />
                    <ThemedText type="defaultSemiBold" style={styles.nutritionType}>
                        {nutrient.nutrition_type}
                    </ThemedText>
                </View>
                <View style={styles.valuesContainer}>
                    <View style={styles.valueContainer}>
                        <ThemedText style={styles.valueLabel}>Total</ThemedText>
                        <ThemedText style={[styles.nutritionValueText, {
                            color: getProgressColor(percentage)
                        }]}>
                            {Math.round(foodValue)}{typeLower === 'calories' || typeLower === 'calorie' ? ' kcal' : ' g'}
                        </ThemedText>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.valueContainer}>
                        <ThemedText style={styles.valueLabel}>Target</ThemedText>
                        <ThemedText style={styles.nutritionValueText}>
                            {Math.round(targetValue)}{typeLower === 'calories' || typeLower === 'calorie' ? ' kcal' : ' g'}
                        </ThemedText>
                    </View>
                </View>
            </View>

            <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                    {/* Background with center marker at 50% (100% target) */}
                    <View style={styles.barBackground}>
                        {/* Left half (0-100%) */}
                        <View style={[
                            styles.progressHalf,
                            { backgroundColor: '#F0F0F0' }
                        ]} />
                        {/* Right half (100-200%) */}
                        <View style={[
                            styles.progressHalf,
                            { backgroundColor: '#E0E0E0' }
                        ]} />
                        {/* Center marker line */}
                        <View style={styles.centerMarker} />
                    </View>

                    {/* Progress fill */}
                    <View style={[
                        styles.progressBarFill,
                        {
                            // Scale percentage to fit 200% range into bar width
                            width: `${Math.min(percentage * 0.5, 100)}%`,
                            backgroundColor: getProgressColor(percentage)
                        }
                    ]} />

                    {/* Percentage label overlay */}
                    <View style={styles.percentageOverlay}>
                        <ThemedText style={[
                            styles.percentageText,
                            { color: getProgressColor(percentage) }
                        ]}>
                            {Math.round(percentage)}%
                        </ThemedText>
                    </View>
                </View>
            </View>

            {nutrient.nutrition_comment && (
                <ThemedText style={styles.commentText}>
                    {formatComment(nutrient.nutrition_comment)}
                </ThemedText>
            )}
        </View>
    );
};

// Custom type for dimensions that bypasses the linting rules
type Dimension = number | string;

// Cast the styles to the correct type
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    } as ViewStyle,
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    } as ViewStyle,
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    } as ViewStyle,
    valuesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    } as ViewStyle,
    separator: {
        width: 1,
        height: 24,
        backgroundColor: '#E0E0E0'
    } as ViewStyle,
    progressBarContainer: {
        width: '100%',
        marginVertical: 12,
        height: 24, // Increased height for percentage overlay
    } as ViewStyle,
    progressBar: {
        height: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative'
    } as ViewStyle,
    barBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flexDirection: 'row'
    } as ViewStyle,
    progressHalf: {
        width: '50%',
        height: '100%'
    } as ViewStyle,
    centerMarker: {
        position: 'absolute',
        left: '50%',
        width: 2,
        height: '100%',
        backgroundColor: '#D0D0D0',
        transform: [{ translateX: -1 }]
    } as ViewStyle,
    progressBarFill: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#47b255',
    } as ViewStyle,
    percentageOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    } as ViewStyle,
    percentageText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333333',
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2
    } as TextStyle,
    nutritionType: {
        fontSize: 16,
        fontWeight: '600',
    } as TextStyle,
    valueContainer: {
        alignItems: 'center',
    } as ViewStyle,
    valueLabel: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 4,
    } as TextStyle,
    nutritionValueText: {
        fontSize: 16,
        fontWeight: '600',
    } as TextStyle,
    commentText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    } as TextStyle
});
