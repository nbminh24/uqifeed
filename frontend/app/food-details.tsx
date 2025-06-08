import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Text, TouchableOpacity, Platform, Alert, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [foodDetails, setFoodDetails] = useState<DetailedFoodResponse['data'] | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEditPress = () => {
        if (id) {
            router.push({
                pathname: '/food-edit',
                params: { id }
            });
        }
    };

    const handleDeletePress = () => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa món ăn này không? Hành động này không thể hoàn tác.',
            [
                {
                    text: 'Hủy',
                    style: 'cancel'
                },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: handleDelete
                }
            ]
        );
    };

    const handleDelete = async () => {
        if (!id) return;

        try {
            setIsDeleting(true);
            const response = await foodService.deleteFood(String(id));

            if (response.success) {
                router.replace("/(tabs)/");
            } else {
                Alert.alert('Lỗi', 'Không thể xóa món ăn. Vui lòng thử lại sau.');
            }
        } catch (err) {
            console.error('[FoodDetails] Delete Error:', err);
            Alert.alert('Lỗi', 'Không thể xóa món ăn. Vui lòng thử lại sau.');
        } finally {
            setIsDeleting(false);
        }
    };

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
                    food_image: response.data.food.food_image,
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
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.headerTitle}>
                        <Text style={styles.foodName} numberOfLines={1}>
                            {foodDetails?.food.food_name}
                        </Text>
                        <Text style={styles.timeText}>
                            {foodDetails?.food.created_at ? new Date(foodDetails.food.created_at).toLocaleString() : ''}
                        </Text>
                    </View>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            style={[styles.editButton, isDeleting && styles.disabledButton]}
                            onPress={() => router.push({ pathname: '/food-edit', params: { id } })}
                            disabled={isDeleting}
                        >
                            <Ionicons name="pencil" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.deleteButton, isDeleting && styles.disabledButton]}
                            onPress={handleDeletePress}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Ionicons name="trash" size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <FoodImage
                        imageUrl={food.food_image || (typeof food.food_description === 'string' ? "https://i.pinimg.com/736x/4b/df/13/4bdf13a13c23d9d873a9ed306ad5a6fa.jpg" : "https://mir-s3-cdn-cf.behance.net/projects/404/7db057114460205.Y3JvcCw5OTksNzgyLDAsMTA4.jpg")}>
                        <NutritionScore nutritionScore={nutritionScore} inBadgeMode={true} />
                    </FoodImage>
                    <CaloriesAndMacros
                        calories={food.total_calorie || 0}
                        protein={food.total_protein || 0}
                        carbs={food.total_carb || 0}
                        fats={food.total_fat || 0}
                    />
                    <IngredientsList ingredients={ingredients} />
                    {nutritionComments.sort((a, b) => {
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
                            nutrient={comment}
                            nutritionScore={nutritionScore}
                            food={food}
                            targetNutrition={targetNutrition}
                            mealType={getMealTypeString(food.meal_type_id)}
                        />
                    ))}
                    <FoodDescriptionInfo food_description={food.food_description} />
                    <FoodAdvice food_advice={food.food_advice} />
                    <FoodPreparation food_preparation={food.food_preparation} />                    <View style={styles.confirmButtonContainer}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => router.replace("/")}
                        >
                            <Text style={styles.confirmButtonText}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ThemedView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    scrollContent: {
        paddingBottom: 32,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingTop: Platform.OS === 'ios' ? 16 : 12,
    },
    headerTitle: {
        flex: 1,
        marginLeft: 12,
    },
    foodName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    timeText: {
        fontSize: 13,
        color: '#6B7280',
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: 8,
        gap: 8,
    },
    editButton: {
        backgroundColor: '#065BAA',
        aspectRatio: 1,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#DC3545',
        aspectRatio: 1,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    confirmButtonContainer: {
        padding: 16,
        marginTop: 16,
    },
    confirmButton: {
        backgroundColor: '#163166',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingText: {
        fontSize: 16,
        color: '#333',
        marginTop: 12,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#163166',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 16,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

