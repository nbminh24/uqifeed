import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import {
    FoodHeader,
    FoodImage,
    NutritionScore,
    CaloriesAndMacros,
    IngredientsList,
    NutrientCard,
    AdviceSection,
    FoodDescriptionInfo,
    FoodAdvice,
    FoodPreparation
} from '@/components/food-details';
import { foodService } from '@/services/foodService';
import { DetailedFoodResponse } from '@/types/food';
import { getMealTypeString } from '@/utils/mealTypeHelper';

const DEFAULT_FOOD_ID = 'm1nI1QwutJ5E07s4dEIr';

export default function FoodDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [foodDetails, setFoodDetails] = useState<DetailedFoodResponse['data'] | null>(null);

    const fetchFoodDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const foodId = id ? String(id) : DEFAULT_FOOD_ID;
            console.log('[FoodDetails] Fetching food with ID:', foodId);
            const response = await foodService.getDetailedFood(foodId);

            console.log('[FoodDetails] Response received:', {
                success: response.success,
                message: response.message,
                hasData: !!response.data
            }); if (response.success) {
                console.log('[FoodDetails] Food data:', {
                    food_name: response.data.food.food_name,
                    has_preparation: !!response.data.food.food_preparation,
                    preparation_type: typeof response.data.food.food_preparation,
                    preparation_data: response.data.food.food_preparation
                });

                // Log targetNutrition for debugging
                console.log('[FoodDetails] Target nutrition data:', {
                    hasTargetNutrition: !!response.data.targetNutrition,
                    targetNutritionType: typeof response.data.targetNutrition,
                    hasDaily: response.data.targetNutrition && !!response.data.targetNutrition.daily,
                    dailyValues: response.data.targetNutrition?.daily
                });

                setFoodDetails(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            console.error('[FoodDetails] Error fetching food details:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch food details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoodDetails();
    }, []); // Empty dependency array means this effect runs once on mount

    const handleRetry = () => {
        fetchFoodDetails();
    };

    // Using the getMealTypeString helper function imported from utils/mealTypeHelper.ts

    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <ActivityIndicator size="large" color="#163166" />
                <Text style={styles.loadingText}>Loading food details...</Text>
            </ThemedView>
        );
    }

    if (error || !foodDetails) {
        return (
            <ThemedView style={styles.container}>
                <Ionicons name="alert-circle" size={48} color="red" />
                <Text style={styles.errorText}>{error || 'Food not found'}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </ThemedView>
        );
    }
    const { food, ingredients, nutritionComments, nutritionScore, targetNutrition: rawTargetNutrition } = foodDetails;

    // Create a default target nutrition if none exists
    const targetNutrition = rawTargetNutrition || {
        id: 'default',
        userId: 'default',
        daily: {
            calories: 2000,
            protein: 50,
            fat: 70,
            carbs: 260,
            fiber: 25
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Log target nutrition for debugging
    console.log('[FoodDetails] Using target nutrition:', {
        isDefault: !rawTargetNutrition,
        dailyValues: targetNutrition.daily
    });

    return (
        <ThemedView style={styles.container}>
            <ScrollView>
                <FoodHeader
                    title={food.food_name}
                    date={new Date(food.created_at).toLocaleDateString()}
                    useAsNavigationHeader={true}
                />                <FoodImage imageUrl={food.food_image}>
                    <NutritionScore nutritionScore={nutritionScore} inBadgeMode={true} />
                </FoodImage><CaloriesAndMacros
                    calories={food.total_calorie || 0}
                    protein={food.total_protein || 0}
                    carbs={food.total_carb || 0}
                    fats={food.total_fat || 0}
                />
                <IngredientsList ingredients={ingredients} />                {nutritionComments.sort((a, b) => {
                    const order = {
                        'calories': 1,
                        'calorie': 1,
                        'total_calorie': 1,
                        'protein': 2,
                        'proteins': 2,
                        'total_protein': 2,
                        'fat': 3,
                        'fats': 3,
                        'total_fat': 3,
                        'carbs': 4,
                        'carb': 4,
                        'total_carb': 4,
                        'fiber': 5,
                        'total_fiber': 5
                    };
                    const orderA = order[a.nutrition_type.toLowerCase() as keyof typeof order] || 99;
                    const orderB = order[b.nutrition_type.toLowerCase() as keyof typeof order] || 99;
                    return orderA - orderB;
                }).map((comment, index) => (
                    <NutrientCard
                        key={index}
                        nutrient={comment} nutritionScore={nutritionScore}
                        food={food}
                        targetNutrition={targetNutrition}
                        mealType={getMealTypeString(food.meal_type_id)}
                    />
                ))}
                <FoodDescriptionInfo food_description={food.food_description} />
                <FoodAdvice food_advice={food.food_advice} />
                <FoodPreparation food_preparation={food.food_preparation} />
            </ScrollView>
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
    }, scrollView: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f2f2f2',
    },
    header: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        paddingBottom: 10,
        alignItems: 'center',
    },
    foodTitle: {
        fontSize: 22,
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    fiberScoreSection: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        margin: 16,
        marginTop: 0,
    },
    fiberHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    fiberScoreText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333',
    },
    fiberScoreBar: {
        height: 12,
        backgroundColor: '#EEEEEE',
        borderRadius: 6,
        marginBottom: 8,
    },
    fiberScoreProgress: {
        width: '10%', // Adjust based on fiber score
        height: '100%',
        backgroundColor: '#FF6B6B',
        borderRadius: 6,
    },
    fiberScoreValue: {
        marginBottom: 12,
    },
    fiberAmountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    fiberDescription: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
    }, imageContainer: {
        width: 300,
        height: 300,
        borderRadius: 150,
        overflow: 'hidden',
        marginVertical: 16,
        position: 'relative',
        alignSelf: 'center',
    },
    foodImage: {
        width: '100%',
        height: '100%',
    }, mascotContainer: {
        position: 'absolute',
        left: 16,
        bottom: 16,
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }, mascotImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    }, nutritionScoreCircle: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: '#47b255',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    }, nutritionScoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    smallerScoreText: {
        fontSize: 20,
    }, nutritionScoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        margin: 16,
        marginBottom: 0,
    }, nutritionDetailsContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        margin: 16,
        marginTop: 8,
        marginBottom: 0,
    },
    nutritionScoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nutritionScoreBadge: {
        position: 'absolute',
        right: 20,
        top: -20,
        zIndex: 10,
    },
    nutritionScoreDetails: {
        marginLeft: 16,
        flex: 1,
    },
    nutritionScoreLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    nutritionScoreDescription: {
        fontSize: 14,
        color: '#666',
    },
    nutritionCard: {
        margin: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    nutritionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    adjustButton: {
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 16,
    },
    adjustButtonText: {
        color: '#333',
        fontSize: 14,
    },
    caloriesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    caloriesValue: {
        fontSize: 32,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    caloriesUnit: {
        fontSize: 16,
        color: '#888',
        marginLeft: 4,
        alignSelf: 'flex-end',
        marginBottom: 4,
    },
    macrosBars: {
        height: 8,
        flexDirection: 'row',
        marginBottom: 16,
    },
    carbsBar: {
        flex: 1,
        height: '100%',
        backgroundColor: '#FFD166',
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    fatsBar: {
        flex: 5,
        height: '100%',
        backgroundColor: '#06D6A0',
    },
    proteinsBar: {
        flex: 10,
        height: '100%',
        backgroundColor: '#118AB2',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    macrosLegendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    macroLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    macroLegendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    carbsDot: {
        backgroundColor: '#FFD166',
    },
    fatsDot: {
        backgroundColor: '#06D6A0',
    },
    proteinsDot: {
        backgroundColor: '#118AB2',
    },
    macroLegendTitle: {
        fontSize: 14,
        color: '#666',
        marginRight: 4,
    },
    macroValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    section: {
        margin: 16,
        marginTop: 0,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    ingredientsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    }, ingredientTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecf6ed',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    }, ingredientText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    ingredientIcon: {
        marginRight: 6,
    },
    feedbackItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    feedbackIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    feedbackContent: {
        flex: 1,
    },
    feedbackTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    feedbackDescription: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#e8f0fe',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color: '#163166',
        fontSize: 14,
    },
    actionButtonsContainer: {
        paddingHorizontal: 16,
        marginVertical: 16,
    },
    actionButton: {
        marginVertical: 8,
    }, bottomPadding: {
        height: 20,
    }, descriptionText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    descriptionSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    descriptionSpacing: {
        marginTop: 16,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center'
    },
    loadingText: {
        fontSize: 16,
        color: '#333',
        marginTop: 12,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#163166',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 16,
    }, retryButtonText: {
        color: '#fff',
        fontSize: 16,
    }
});

