import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, View, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { textAnalysisService } from '@/services/textAnalysisService';
import { foodService } from '@/services/foodService';
import { mealTypeService } from '@/services/mealTypeService';
import { NormalizedMealType, normalizeMealTypes } from '@/utils/mealTypeNormalizer';

export default function TextAnalyzeScreen() {
    const router = useRouter();
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(''); const [mealTypes, setMealTypes] = useState<NormalizedMealType[]>([]);
    const [selectedMealTypeId, setSelectedMealTypeId] = useState<string>(''); // Will be set when meal types are loaded
    const [loadingMealTypes, setLoadingMealTypes] = useState(false);// Fetch meal types when component mounts
    useEffect(() => {
        const fetchMealTypes = async () => {
            try {
                setLoadingMealTypes(true);
                const response = await mealTypeService.getAllMealTypes(); if (response.success && response.data.mealTypes) {
                    const normalizedMealTypes = normalizeMealTypes(response.data.mealTypes);
                    setMealTypes(normalizedMealTypes);
                    // Set initial meal type ID (first one in the list)
                    if (normalizedMealTypes.length > 0 && !selectedMealTypeId) {
                        setSelectedMealTypeId(normalizedMealTypes[0].id);
                    }
                    console.log('[TextAnalyze] Loaded meal types:', normalizedMealTypes);

                    // Log meal type IDs to debug
                    normalizedMealTypes.forEach(mt => {
                        console.log(`Meal type: ${mt.name}, ID: ${mt.id} (original: ${mt.originalId})`);
                    });
                }
            } catch (err) {
                console.error('[TextAnalyze] Error loading meal types:', err);
            } finally {
                setLoadingMealTypes(false);
            }
        };

        fetchMealTypes();
    }, []);

    const handleAnalyze = async () => {
        if (!text.trim()) {
            setError('Please enter some text to analyze');
            return;
        } setError('');
        setIsAnalyzing(true);
        try {
            // Step 1: Analyze the text to get a food ID with selected meal type
            const analysisResponse = await textAnalysisService.analyzeText(text.trim(), selectedMealTypeId);
            console.log('[TextAnalyze] Got successful analysis response with meal type ID:', selectedMealTypeId);

            if (!analysisResponse.data?.food?.id) {
                throw new Error('Could not process food data. Please try again');
            }

            const foodId = analysisResponse.data.food.id;

            // Step 2: Use the foodService to get complete food details, including targetNutrition
            console.log('[TextAnalyze] Fetching detailed food info for', foodId);
            const detailedResponse = await foodService.getDetailedFood(foodId);

            if (!detailedResponse.success) {
                throw new Error('Could not retrieve complete food details');
            }

            // Verify the nutritional data is present in the response
            const food = detailedResponse.data.food;
            if (!food.total_protein || !food.total_carb || !food.total_fat ||
                !food.total_fiber || !food.total_calorie) {
                console.warn('[TextAnalyze] Some nutritional values are missing in the response:', food);
            }

            // Navigation with complete data
            router.push({
                pathname: '/food-details',
                params: { id: foodId }
            });

        } catch (err: any) {
            console.error('[TextAnalyze] Error:', err);
            setError(err.message || 'Could not analyze the text. Please try again');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{
                title: 'Text Analysis',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#163166',
                },
                headerTintColor: '#fff',
            }} />

            <ScrollView style={styles.scrollView}>
                <ThemedView style={styles.contentContainer}>
                    <ThemedText style={styles.description}>
                        Enter your food description here for nutritional analysis
                    </ThemedText>

                    <TextInput
                        style={styles.textInput}
                        multiline
                        numberOfLines={6}
                        placeholder="Example: 2 cups of rice, 1 chicken breast, and a bowl of vegetables..."
                        placeholderTextColor="#999"
                        value={text}
                        onChangeText={setText}
                    />

                    <ThemedText style={styles.sectionTitle}>
                        Select Meal Type
                    </ThemedText>

                    <ThemedText style={styles.helperText}>
                        Choosing the right meal type helps get accurate nutritional recommendations
                    </ThemedText>

                    {loadingMealTypes ? (
                        <ActivityIndicator size="small" color="#163166" style={styles.loading} />
                    ) : (
                        <View style={styles.mealTypeContainer}>
                            {mealTypes.map((mealType) => {
                                const isSelected = selectedMealTypeId === mealType.id;

                                return (
                                    <TouchableOpacity
                                        key={mealType.originalId}
                                        style={[
                                            styles.mealTypeButton,
                                            isSelected && styles.selectedMealType
                                        ]}
                                        onPress={() => {
                                            console.log(`Selecting meal type: ${mealType.name} with ID: ${mealType.id}`);
                                            setSelectedMealTypeId(mealType.id);
                                        }}
                                    >
                                        <ThemedText
                                            style={[
                                                styles.mealTypeText,
                                                isSelected && styles.selectedMealTypeText
                                            ]}
                                        >
                                            {mealType.name}
                                        </ThemedText>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    {error ? (
                        <ThemedText style={styles.errorText}>{error}</ThemedText>
                    ) : null}

                    <Button
                        title={isAnalyzing ? "Analyzing..." : "Analyze Text"}
                        onPress={handleAnalyze}
                        disabled={isAnalyzing || !text.trim()}
                        style={styles.analyzeButton}
                    />
                </ThemedView>
            </ScrollView >
        </ThemedView >
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
    contentContainer: {
        flex: 1,
        padding: 16,
        width: '100%',
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 16,
        textAlign: 'center',
    },
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        minHeight: 150,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        textAlignVertical: 'top',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 8,
    },
    helperText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    mealTypeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    mealTypeButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedMealType: {
        backgroundColor: '#163166',
        borderColor: '#163166',
    },
    mealTypeText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#444',
    },
    selectedMealTypeText: {
        color: '#fff',
    },
    analyzeButton: {
        backgroundColor: '#163166',
        borderRadius: 12,
        paddingVertical: 14,
        width: '100%',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    errorText: {
        color: '#dc3545',
        fontSize: 14,
        marginBottom: 8,
    },
    loading: {
        marginVertical: 20,
    }
});
