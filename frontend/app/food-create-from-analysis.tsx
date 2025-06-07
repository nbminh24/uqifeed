import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { foodService } from '@/services/foodService';
import { Picker } from '@react-native-picker/picker';
import { mealTypeService } from '@/services/mealTypeService';

export default function FoodCreateFromAnalysisScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [textDescription, setTextDescription] = useState('');
    const [selectedMealTypeId, setSelectedMealTypeId] = useState('');
    const [mealTypes, setMealTypes] = useState<any[]>([]);
    const [analysisType, setAnalysisType] = useState<'text' | 'image'>('text');
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{
        textDescription?: string;
        mealType?: string;
    }>({});

    React.useEffect(() => {
        fetchMealTypes();
    }, []);

    const fetchMealTypes = async () => {
        try {
            const response = await mealTypeService.getMealTypes();
            if (response.success && response.data) {
                setMealTypes(response.data);
                if (response.data.length > 0) {
                    setSelectedMealTypeId(response.data[0].id);
                }
            }
        } catch (error) {
            console.error("[FoodCreateFromAnalysis] Error fetching meal types:", error);
            setError("Could not load meal types");
        }
    };

    const validateForm = () => {
        const errors: {
            textDescription?: string;
            mealType?: string;
        } = {};

        if (analysisType === 'text' && !textDescription.trim()) {
            errors.textDescription = 'Food description is required';
        }

        if (!selectedMealTypeId) {
            errors.mealType = 'Meal type is required';
        }

        // For image analysis, we would check base64Image here
        if (analysisType === 'image' && !base64Image) {
            Alert.alert('Error', 'Please select an image to analyze');
            return false;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAnalyze = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please check the form for errors');
            return;
        }

        try {
            setAnalyzing(true);
            setError(null);

            const analysisData = {
                analysis_type: analysisType,
                meal_type_id: selectedMealTypeId,
                ...(analysisType === 'text' ? { textDescription } : { base64Image }),
            };

            const response = await foodService.createOrUpdateFromAnalysis(analysisData);

            if (!response?.success || !response?.data?.food) {
                throw new Error('Failed to analyze and save food: Invalid response format');
            }

            console.log('[FoodCreateFromAnalysis] Food created successfully with ID:', response.data.food.id);

            // Navigate to new food details
            router.replace({
                pathname: '/food-details',
                params: {
                    id: response.data.food.id,
                    refresh: Date.now().toString()
                }
            });
        } catch (err) {
            console.error('[FoodCreateFromAnalysis] Error:', err);
            setError(err instanceof Error ? err.message : 'Failed to analyze and create food');
        } finally {
            setAnalyzing(false);
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
                    title: 'Create Food from Analysis',
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={handleAnalyze}
                            disabled={analyzing}
                            style={styles.analyzeButton}
                        >
                            {analyzing ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <ThemedText style={styles.analyzeButtonText}>Analyze</ThemedText>
                            )}
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.scrollView}>
                <View style={styles.form}>
                    {error && (
                        <View style={styles.errorContainer}>
                            <ThemedText style={styles.errorText}>{error}</ThemedText>
                        </View>
                    )}

                    <View style={styles.analysisTypeContainer}>
                        <ThemedText style={styles.label}>Analysis Type</ThemedText>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={[styles.radioButton, analysisType === 'text' && styles.radioButtonSelected]}
                                onPress={() => setAnalysisType('text')}
                            >
                                <Ionicons
                                    name={analysisType === 'text' ? "radio-button-on" : "radio-button-off"}
                                    size={24}
                                    color="#163166"
                                />
                                <ThemedText style={styles.radioText}>Text Analysis</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, analysisType === 'image' && styles.radioButtonSelected]}
                                onPress={() => setAnalysisType('image')}
                            >
                                <Ionicons
                                    name={analysisType === 'image' ? "radio-button-on" : "radio-button-off"}
                                    size={24}
                                    color="#163166"
                                />
                                <ThemedText style={styles.radioText}>Image Analysis</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ThemedText style={styles.label}>Meal Type</ThemedText>
                    <View style={[styles.pickerContainer, validationErrors.mealType && styles.inputError]}>
                        <Picker
                            selectedValue={selectedMealTypeId}
                            onValueChange={(itemValue) => {
                                setSelectedMealTypeId(itemValue);
                                if (validationErrors.mealType) {
                                    setValidationErrors(prev => ({ ...prev, mealType: undefined }));
                                }
                            }}
                            style={styles.picker}
                        >
                            {mealTypes.map(type => (
                                <Picker.Item key={type.id} label={type.name} value={type.id} />
                            ))}
                        </Picker>
                    </View>
                    {validationErrors.mealType && (
                        <ThemedText style={styles.errorText}>{validationErrors.mealType}</ThemedText>
                    )}

                    {analysisType === 'text' && (
                        <>
                            <ThemedText style={styles.label}>Food Description</ThemedText>
                            <TextInput
                                style={[styles.textInput, validationErrors.textDescription && styles.inputError]}
                                value={textDescription}
                                onChangeText={(text) => {
                                    setTextDescription(text);
                                    if (validationErrors.textDescription) {
                                        setValidationErrors(prev => ({ ...prev, textDescription: undefined }));
                                    }
                                }}
                                placeholder="Describe your food and ingredients (e.g. Rice with chicken and vegetables)"
                                multiline
                                numberOfLines={6}
                            />
                            {validationErrors.textDescription && (
                                <ThemedText style={styles.errorText}>{validationErrors.textDescription}</ThemedText>
                            )}
                        </>
                    )}

                    {analysisType === 'image' && (
                        <View style={styles.imageSection}>
                            <ThemedText style={styles.label}>Food Image</ThemedText>
                            <TouchableOpacity style={styles.imagePickerButton}>
                                <Ionicons name="camera" size={24} color="#163166" />
                                <ThemedText style={styles.imagePickerText}>Select Image</ThemedText>
                            </TouchableOpacity>
                            <ThemedText style={styles.helperText}>
                                Select a clear image of your food to analyze its nutritional content.
                            </ThemedText>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom analyze button */}
            <View style={styles.analyzeButtonContainer}>
                <TouchableOpacity
                    style={[styles.bottomAnalyzeButton, analyzing && styles.analyzeButtonDisabled]}
                    onPress={handleAnalyze}
                    disabled={analyzing}
                >
                    {analyzing ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <ThemedText style={styles.analyzeButtonText}>Analyze & Create</ThemedText>
                    )}
                </TouchableOpacity>
            </View>
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
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 10,
        borderRadius: 4,
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
        minHeight: 150,
        marginBottom: 16,
    },
    inputError: {
        borderColor: '#f44336',
    },
    errorText: {
        color: '#f44336',
        marginBottom: 16,
    },
    analyzeButton: {
        backgroundColor: '#163166',
        padding: 8,
        borderRadius: 4,
        minWidth: 80,
        alignItems: 'center',
    },
    analyzeButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    analyzeButtonContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    bottomAnalyzeButton: {
        backgroundColor: '#163166',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    analyzeButtonDisabled: {
        opacity: 0.7,
    },
    helperText: {
        color: '#666',
        fontSize: 14,
        marginTop: 8,
    },
    analysisTypeContainer: {
        marginBottom: 16,
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        flex: 1,
        marginRight: 8,
    },
    radioButtonSelected: {
        backgroundColor: '#e6f0ff',
    },
    radioText: {
        marginLeft: 8,
    },
    imageSection: {
        marginBottom: 16,
    },
    imagePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    imagePickerText: {
        marginLeft: 8,
        color: '#163166',
    },
});
