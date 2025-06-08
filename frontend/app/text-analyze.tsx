import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, View, ScrollView, Platform } from 'react-native';
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
                headerShown: false
            }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Text Analysis</ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.mainContent}>
                    <View style={styles.card}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Describe the food you'd like to analyze..."
                            value={text}
                            onChangeText={setText}
                            multiline
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.actionCard}>
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Analyze Food"
                                onPress={handleAnalyze}
                                style={[styles.button, styles.analyzeButton]}
                                disabled={isAnalyzing || !text.trim() || !selectedMealTypeId}
                            >
                                {isAnalyzing && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />}
                            </Button>
                        </View>

                        <View style={styles.mealTypeSection}>
                            <ThemedText style={styles.sectionTitle}>Select Meal Type</ThemedText>
                            {loadingMealTypes ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="#163166" />
                                </View>
                            ) : (
                                <View style={styles.mealTypeContainer}>
                                    {mealTypes.map((mealType) => (
                                        <TouchableOpacity
                                            key={mealType.id}
                                            style={[
                                                styles.mealTypeButton,
                                                selectedMealTypeId === mealType.id && styles.mealTypeButtonSelected,
                                            ]}
                                            onPress={() => setSelectedMealTypeId(mealType.id)}
                                        >
                                            <ThemedText
                                                style={[
                                                    styles.mealTypeText,
                                                    selectedMealTypeId === mealType.id && styles.mealTypeTextSelected,
                                                ]}
                                            >
                                                {mealType.name}
                                            </ThemedText>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
        paddingTop: Platform.OS === 'ios' ? 48 : 32,
    },
    contentContainer: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    mainContent: {
        paddingHorizontal: 16,
        flex: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 24,
    },
    textInput: {
        fontSize: 15,
        color: '#333',
        minHeight: 150, // Increased height
        textAlignVertical: 'top',
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
    },
    actionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    buttonContainer: {
        marginBottom: 20,
    },
    button: {
        height: 44, // Smaller height
        borderRadius: 10,
    },
    analyzeButton: {
        backgroundColor: '#1E293B', // Darker blue
    },
    mealTypeSection: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    mealTypeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    mealTypeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F3F4F6',
    },
    mealTypeButtonSelected: {
        backgroundColor: '#334155', // Darker slate color
        borderColor: '#334155',
    },
    mealTypeText: {
        fontSize: 14,
        color: '#64748B',
    },
    mealTypeTextSelected: {
        color: '#fff',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
});
