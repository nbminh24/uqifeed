import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IngredientInput } from '@/components/food-edit';
import { foodService } from '@/services/foodService';
import { textAnalysisService } from '@/services/textAnalysisService';
import { DetailedFoodResponse } from '@/types/food';
import { TextAnalysisResponse } from '@/types/analysis';

interface Ingredient {
    id?: string;
    ingredient_name: string;
    ingredient_amount: string | number;
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
    const [validationErrors, setValidationErrors] = useState<{
        foodName?: string;
        ingredients?: string[];
    }>({});

    useEffect(() => {
        fetchFoodDetails();
    }, []);

    const fetchFoodDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await foodService.getDetailedFood(String(id));

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

    const validateForm = () => {
        const errors: {
            foodName?: string;
            ingredients?: string[];
        } = {};

        if (!foodName.trim()) {
            errors.foodName = 'Food name is required';
        }

        const ingredientErrors: string[] = [];
        ingredients.forEach((ing, index) => {
            if (!ing.ingredient_name.trim()) {
                ingredientErrors[index] = 'Ingredient name is required';
            }
            const amount = Number(ing.ingredient_amount);
            if (isNaN(amount) || amount <= 0) {
                ingredientErrors[index] = 'Amount must be a positive number';
            }
        });

        if (ingredientErrors.length > 0) {
            errors.ingredients = ingredientErrors;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
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

        // Clear validation error for this ingredient
        if (validationErrors.ingredients?.[index]) {
            const newErrors = { ...validationErrors };
            if (newErrors.ingredients) {
                newErrors.ingredients[index] = '';
                setValidationErrors(newErrors);
            }
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please check the form for errors');
            return;
        }

        if (!originalFoodDetails?.food?.id || !originalFoodDetails?.food?.meal_type_id) {
            setError('Original food data not found');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            // Format ingredients text
            const ingredients_text = ingredients
                .map(ing => `${ing.ingredient_amount}g ${ing.ingredient_name}`)
                .join(', ');
            const textDescription = `${foodName}. Ingredients: ${ingredients_text}`;

            // Get updated nutrition info
            const analysisResponse = await textAnalysisService.analyzeText(
                textDescription,
                originalFoodDetails.food.meal_type_id
            );

            if (!analysisResponse.success) {
                throw new Error('Failed to analyze food');
            }

            // Navigate back to details screen
            router.replace({
                pathname: '/food-details',
                params: {
                    id: id,
                    refresh: Date.now().toString()
                }
            });
        } catch (err) {
            console.error('[FoodEdit] Error:', err);
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

    if (error) {
        return (
            <ThemedView style={[styles.container, styles.centered]}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
                <TouchableOpacity style={styles.retryButton} onPress={fetchFoodDetails}>
                    <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
                </TouchableOpacity>
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
                        style={[styles.input, validationErrors.foodName && styles.inputError]}
                        value={foodName}
                        onChangeText={(text) => {
                            setFoodName(text);
                            if (validationErrors.foodName) {
                                setValidationErrors(prev => ({ ...prev, foodName: undefined }));
                            }
                        }}
                        placeholder="Enter food name"
                    />
                    {validationErrors.foodName && (
                        <ThemedText style={styles.errorText}>{validationErrors.foodName}</ThemedText>
                    )}

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
                        <IngredientInput
                            key={index}
                            index={index}
                            name={ingredient.ingredient_name}
                            amount={ingredient.ingredient_amount}
                            error={validationErrors.ingredients?.[index]}
                            onChangeName={(value) => handleIngredientChange(index, 'ingredient_name', value)}
                            onChangeAmount={(value) => handleIngredientChange(index, 'ingredient_amount', value)}
                            onRemove={() => handleRemoveIngredient(index)}
                        />
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
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
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
    inputError: {
        borderColor: '#FF4D4F',
        borderWidth: 1,
    },
    errorText: {
        color: '#FF4D4F',
        fontSize: 12,
        marginTop: 4,
        marginBottom: 8,
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
    saveButton: {
        marginRight: 16,
        padding: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    retryButton: {
        backgroundColor: '#163166',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});
