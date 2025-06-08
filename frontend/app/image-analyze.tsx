import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ActivityIndicator, Alert, Platform, Text, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { ButtonWithIcon } from '@/components/ui/ButtonWithIcon';
import { imageAnalysisService } from '@/services/imageAnalysisService';
import { mealTypeService } from '@/services/mealTypeService';
import { NormalizedMealType, normalizeMealTypes } from '@/utils/mealTypeNormalizer';

export default function ImageAnalyzeScreen() {
    const router = useRouter();
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [libraryPermission, setLibraryPermission] = useState<boolean | null>(null);
    const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [capturedImageBase64, setCapturedImageBase64] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [mealTypes, setMealTypes] = useState<NormalizedMealType[]>([]);
    const [selectedMealTypeId, setSelectedMealTypeId] = useState<string>('');
    const [loadingMealTypes, setLoadingMealTypes] = useState<boolean>(false);
    const cameraRef = useRef<CameraView>(null);

    useEffect(() => {
        (async () => {
            if (!cameraPermission?.granted) {
                await requestCameraPermission();
            }

            const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setLibraryPermission(libraryStatus === 'granted');

            if (!cameraPermission?.granted || libraryStatus !== 'granted') {
                Alert.alert(
                    'Permissions Required',
                    'Camera and photo library permissions are required for this app to function properly.',
                    [{ text: 'OK' }]
                );
            }
        })();
    }, [cameraPermission, requestCameraPermission]);

    // Load meal types when component mounts
    useEffect(() => {
        const fetchMealTypes = async () => {
            try {
                setLoadingMealTypes(true);
                const response = await mealTypeService.getAllMealTypes();
                if (response.success && response.data.mealTypes) {
                    const normalizedMealTypes = normalizeMealTypes(response.data.mealTypes);
                    setMealTypes(normalizedMealTypes);
                    // Set initial meal type ID (first one in the list)
                    if (normalizedMealTypes.length > 0 && !selectedMealTypeId) {
                        setSelectedMealTypeId(normalizedMealTypes[0].id);
                    }
                    console.log('[ImageAnalyze] Loaded meal types:', normalizedMealTypes);
                }
            } catch (err) {
                console.error('[ImageAnalyze] Error loading meal types:', err);
                setError('Could not load meal types');
            } finally {
                setLoadingMealTypes(false);
            }
        };

        fetchMealTypes();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.7,
                    base64: true,
                });
                setCapturedImage(photo.uri);
                if (photo.base64) {
                    setCapturedImageBase64(`data:image/jpeg;base64,${photo.base64}`);
                }
                setShowCamera(false);
            } catch (error) {
                console.error('Error taking picture:', error);
                Alert.alert('Error', 'Failed to take picture. Please try again.');
            }
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setCapturedImage(result.assets[0].uri);
                const base64Image = result.assets[0].base64;
                if (base64Image) {
                    setCapturedImageBase64(`data:image/jpeg;base64,${base64Image}`);
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const analyzeImage = async () => {
        if (!capturedImageBase64 || !selectedMealTypeId) {
            setError('Please capture an image and select a meal type');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const analysisResponse = await imageAnalysisService.analyzeImage(
                capturedImageBase64,
                selectedMealTypeId
            );

            if (!analysisResponse.data?.food?.id) {
                throw new Error('Could not process food data. Please try again');
            }

            const foodId = analysisResponse.data.food.id;

            // Navigate to the food details screen with the analyzed data
            router.push({
                pathname: '/food-details',
                params: { id: foodId }
            });
        } catch (error: any) {
            console.error('Error analyzing image:', error);
            setError(error.message || 'Failed to analyze image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCamera = () => {
        if (capturedImage) {
            setCapturedImage(null);
        } else {
            setShowCamera(!showCamera);
        }
    }; const toggleCameraType = () => {
        setCameraType(current => (
            current === 'back' ? 'front' : 'back'
        ));
    }; if (cameraPermission === null || libraryPermission === null) {
        return (
            <ThemedView style={styles.container}>
                <ActivityIndicator size="large" color="#163166" />
                <ThemedText style={styles.permissionText}>Requesting camera permissions...</ThemedText>
            </ThemedView>
        );
    }

    if (!cameraPermission?.granted || !libraryPermission) {
        return (<ThemedView style={styles.container}>
            <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
            <ThemedText style={styles.permissionText}>
                No access to camera or photo library. Please enable permissions in your device settings.
            </ThemedText>
        </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Image Analysis</ThemedText>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={styles.imageContainer}>
                        {capturedImage ? (
                            <Image
                                source={{ uri: capturedImage }}
                                style={styles.previewImage}
                            />
                        ) : showCamera ? (
                            <CameraView
                                ref={cameraRef}
                                style={styles.previewImage}
                                facing={cameraType}
                                onMountError={(error) => {
                                    console.error('Camera mount error:', error);
                                    setError('Failed to initialize camera');
                                }}
                            />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Ionicons name="images-outline" size={48} color="#666" />
                                <ThemedText style={styles.instructionsText}>
                                    Take a picture or select an image
                                </ThemedText>
                            </View>
                        )}
                    </View>

                    {showCamera ? (
                        <View style={styles.cameraControls}>
                            <Button
                                title="Take Picture"
                                onPress={takePicture}
                                style={styles.button}
                            />
                            <Button
                                title="Switch Camera"
                                onPress={() => setCameraType(prev => prev === 'back' ? 'front' : 'back')}
                                style={styles.button}
                            />
                        </View>
                    ) : (
                        <>
                            {!capturedImage && (
                                <View style={styles.imageActions}>
                                    <TouchableOpacity
                                        style={styles.imageActionButton}
                                        onPress={() => setShowCamera(true)}
                                    >
                                        <Ionicons name="camera" size={32} color="#334155" />
                                        <ThemedText style={styles.actionButtonText}>Take Photo</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.imageActionButton}
                                        onPress={pickImage}
                                    >
                                        <Ionicons name="images" size={32} color="#334155" />
                                        <ThemedText style={styles.actionButtonText}>Pick Image</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )}
                </View>

                <View style={styles.actionCard}>
                    <ThemedText style={styles.sectionTitle}>Select Meal Type</ThemedText>
                    {loadingMealTypes ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#163166" />
                        </View>
                    ) : (
                        <View style={styles.mealTypeContainer}>
                            {mealTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.id}
                                    style={[
                                        styles.mealTypeButton,
                                        selectedMealTypeId === type.id && styles.mealTypeButtonSelected,
                                    ]}
                                    onPress={() => setSelectedMealTypeId(type.id)}
                                >
                                    <ThemedText style={[
                                        styles.mealTypeText,
                                        selectedMealTypeId === type.id && styles.mealTypeTextSelected,
                                    ]}>
                                        {type.name}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {capturedImage && (
                        <View style={styles.buttonContainer}>
                            <Button
                                title={isLoading ? "Analyzing..." : "Analyze"}
                                onPress={analyzeImage}
                                style={[styles.button, styles.analyzeButton]}
                                disabled={isLoading || !selectedMealTypeId}
                            />
                            <Button
                                title="Reset"
                                onPress={() => {
                                    setCapturedImage(null);
                                    setCapturedImageBase64(null);
                                }}
                                style={styles.button}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>

            {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#5046E5" />
                </View>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
        paddingTop: Platform.OS === 'ios' ? 48 : 32,
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
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
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
    imageContainer: {
        aspectRatio: 4 / 3,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructionsText: {
        fontSize: 15,
        color: '#666',
        marginTop: 12,
        textAlign: 'center',
    },
    imageActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    imageActionButton: {
        flex: 1,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    actionButtonText: {
        fontSize: 14,
        color: '#334155',
        marginTop: 8,
        fontWeight: '500',
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
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    button: {
        height: 44,
        borderRadius: 10,
    },
    analyzeButton: {
        backgroundColor: '#1E293B',
    },
    buttonContainer: {
        marginTop: 20,
        gap: 12,
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
        backgroundColor: '#334155',
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
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraControls: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    permissionText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginTop: 12,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
});

