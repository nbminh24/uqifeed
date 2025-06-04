import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { foodService } from '@/services/foodService';
import { textAnalysisService } from '@/services/textAnalysisService';
import { DetailedFoodResponse } from '@/types/food';

interface Ingredient {
    id?: string;
    ingredient_name: string;
    ingredient_amount: string | number;
}

interface AnalysisIngredient {
    'Ingredient Name': string;
    'Ingredient Amount': string;
    'Ingredient Protein': string;
    'Ingredient Carb': string;
    'Ingredient Fat': string;
    'Ingredient Fiber': string;
    'Ingredient Description': Record<string, string>;
}

interface AnalysisResponse {
    success: boolean;
    data: {
        food: {
            food_name: string;
            food_description: Record<string, string>;
            food_advice: Record<string, string>;
            food_preparation: Record<string, any>;
            foodIngredientList: AnalysisIngredient[];
        }
    }
}

export default function FoodEditScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [foodName, setFoodName] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [originalFoodDetails, setOriginalFoodDetails] = useState<DetailedFoodResponse['data'] | null>(null);

    useEffect(() => {
        fetchFoodDetails();
    }, []);

    const fetchFoodDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const foodId = String(id);
            const response = await foodService.getDetailedFood(foodId);

            if (response.success) {
                setFoodName(response.data.food.food_name);
                setIngredients(response.data.ingredients.map(ing => ({
                    id: ing.id,
                    ingredient_name: ing.ingredient_name,
                    ingredient_amount: ing.ingredient_amount,
                })));
                setOriginalFoodDetails(response.data);
            } else {
                setError('Could not load food details');
            }
        } catch (err) {
            console.error('[FoodEdit] Error:', err);
            setError('Failed to load food details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { ingredient_name: '', ingredient_amount: '' }]);
    };

    const handleRemoveIngredient = (index: number) => {
        const newIngredients = [...ingredients];
        newIngredients.splice(index, 1);
        setIngredients(newIngredients);
    };

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = {
            ...newIngredients[index],
            [field]: value,
        };
        setIngredients(newIngredients);
    };

    const handleSave = async () => {
        if (!originalFoodDetails?.food?.id || !originalFoodDetails?.food?.meal_type_id) {
            setError('Original food data not found');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            // Construct text description for re-analysis
            const ingredients_text = ingredients
                .map(ing => `${ing.ingredient_amount} ${ing.ingredient_name}`)
                .join(', ');
            const textDescription = `${foodName}. Ingredients: ${ingredients_text}`;

            // Re-analyze with text analysis service to get updated nutrition info
            const analysisResponse = await textAnalysisService.analyzeText(
                textDescription,
                originalFoodDetails.food.meal_type_id
            ) as AnalysisResponse;

            // Create new food record with analysis data and original image
            const { food } = analysisResponse.data;
            const newFoodData = {
                food_name: foodName,
                food_image: originalFoodDetails.food.food_image,
                cloudinary_public_id: originalFoodDetails.food.cloudinary_public_id,
                meal_type_id: originalFoodDetails.food.meal_type_id,
                food_description: food.food_description,
                food_advice: food.food_advice,
                food_preparation: food.food_preparation,
                ingredients: ingredients.map(ing => {
                    // Find corresponding ingredient from analysis
                    const analysisIngredient = food.foodIngredientList?.find(
                        ai => ai['Ingredient Name']?.toLowerCase() === ing.ingredient_name?.toLowerCase()
                    );

                    return {
                        ingredient_name: ing.ingredient_name,
                        ingredient_amount: ing.ingredient_amount,
                        ingredient_protein: analysisIngredient?.['Ingredient Protein'] || '0g',
                        ingredient_carb: analysisIngredient?.['Ingredient Carb'] || '0g',
                        ingredient_fat: analysisIngredient?.['Ingredient Fat'] || '0g',
                        ingredient_fiber: analysisIngredient?.['Ingredient Fiber'] || '0g',
                        ingredient_description: analysisIngredient?.['Ingredient Description'] || {}
                    };
                })
            };

            // Create new food record
            const createResponse = await foodService.createFood(newFoodData);

            if (!createResponse.success) {
                throw new Error('Failed to create new food version');
            }

            // Delete the old food only after successful creation
            await foodService.deleteFood(originalFoodDetails.food.id);

            Alert.alert('Success', 'Food updated successfully', [{
                text: 'OK',
                onPress: () => {
                    // Navigate to the details of the newly created food
                    router.navigate({
                        pathname: '/food-details',
                        params: {
                            id: createResponse.data.food.id,
                            refresh: Date.now().toString()
                        }
                    });
                }
            }]);

        } catch (err) {
            console.error('[FoodEdit] Save Error:', err);
            setError(err instanceof Error ? err.message : 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <ActivityIndicator size="large" color="#163166" />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Edit Food',
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={saving}
                            style={styles.saveButton}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                            )}
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.scrollView}>
                <View style={styles.form}>
                    <ThemedText style={styles.label}>Food Name</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={foodName}
                        onChangeText={setFoodName}
                        placeholder="Enter food name"
                    />

                    <View style={styles.ingredientsHeader}>
                        <ThemedText style={styles.label}>Ingredients</ThemedText>
                        <TouchableOpacity
                            onPress={handleAddIngredient}
                            style={styles.addButton}
                        >
                            <Ionicons name="add-circle" size={24} color="#163166" />
                            <ThemedText style={styles.addButtonText}>Add Ingredient</ThemedText>
                        </TouchableOpacity>
                    </View>

                    {ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.ingredientRow}>
                            <View style={styles.ingredientInputs}>
                                <TextInput
                                    style={[styles.input, styles.ingredientName]}
                                    value={ingredient.ingredient_name}
                                    onChangeText={(value) => handleIngredientChange(index, 'ingredient_name', value)}
                                    placeholder="Ingredient name"
                                />
                                <TextInput
                                    style={[styles.input, styles.ingredientAmount]}
                                    value={String(ingredient.ingredient_amount)}
                                    onChangeText={(value) => handleIngredientChange(index, 'ingredient_amount', value)}
                                    placeholder="Amount"
                                    keyboardType="decimal-pad"
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => handleRemoveIngredient(index)}
                                style={styles.removeButton}
                            >
                                <Ionicons name="remove-circle" size={24} color="#FF6B6B" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollView: {
        flex: 1,
    },
    form: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 16,
        fontSize: 16,
    },
    ingredientsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    addButtonText: {
        marginLeft: 8,
        color: '#163166',
        fontSize: 16,
        fontWeight: '500',
    },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    ingredientInputs: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 8,
    },
    ingredientName: {
        flex: 2,
        marginRight: 8,
        marginBottom: 0,
    },
    ingredientAmount: {
        flex: 1,
        marginBottom: 0,
    },
    removeButton: {
        padding: 8,
    },
    saveButton: {
        marginRight: 16,
        padding: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});
