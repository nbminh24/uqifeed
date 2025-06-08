import { getApiUrl } from '../constants/Config';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

// Interface for React Native file objects
interface ReactNativeFileInfo {
    uri: string;
    type: string;
    name: string;
}

interface ImageAnalysisResponse {
    success: boolean;
    message: string;
    data: {
        food: {
            id: string;
            food_name: string;
            food_image: string;
            cloudinary_public_id?: string;
            food_description: Record<string, string>;
            food_advice: Record<string, string>;
            food_preparation: Record<string, any>;
            total_calorie: number;
            total_protein: number;
            total_carb: number;
            total_fat: number;
            total_fiber: number;
        };
        ingredients: Array<any>;
        nutritionScore: {
            score: number;
            interpretation: string;
        };
        nutritionComments: Record<string, any>;
    };
}

export const imageAnalysisService = {
    analyzeImage: async (base64Image: string, meal_type_id: string): Promise<ImageAnalysisResponse> => {
        try {
            // Debug Log: Request preparation
            console.log('[ImageAnalysisService] Starting image analysis with:', {
                meal_type_id,
                hasImage: !!base64Image,
                imageLength: base64Image?.length || 0
            });

            // Validate input
            if (!base64Image) throw new Error('Image data is required');
            if (!meal_type_id) throw new Error('Meal type ID is required');

            // Get API URL
            const apiUrl = getApiUrl('/api/one-stop-analysis/upload');
            console.log('[ImageAnalysisService] Request URL:', apiUrl);

            // Create temporary file from base64
            const tempUri = FileSystem.documentDirectory + 'temp_image.jpg';
            try {
                // Extract base64 data without the prefix
                const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
                await FileSystem.writeAsStringAsync(tempUri, base64Data, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                // Compress the image with size reduction
                const compressedImage = await ImageManipulator.manipulateAsync(
                    tempUri,
                    [
                        { resize: { width: 800 } } // Resize to 800px width, maintain aspect ratio
                    ],
                    {
                        compress: 0.2, // 20% quality
                        format: ImageManipulator.SaveFormat.JPEG,
                    }
                );

                // Check compressed file size
                const fileInfo = await FileSystem.getInfoAsync(compressedImage.uri, { size: true });
                if (!fileInfo.exists) {
                    throw new Error('Compressed image file not found');
                }
                if (fileInfo.size > 1048000) { // Leave some buffer below the 1,048,487 limit
                    throw new Error('Image is too large even after compression. Please use a smaller image.');
                }

                // Create FormData
                const formData = new FormData();

                // Create the file object in the format React Native expects
                const imageFile = {
                    uri: compressedImage.uri,
                    type: 'image/jpeg',
                    name: `food_image_${Date.now()}.jpg`,
                };

                // Add file and meal type to form data
                // @ts-ignore - React Native's FormData accepts objects with uri, type, and name
                formData.append('image', imageFile);
                formData.append('meal_type_id', meal_type_id.toString());

                // Make API request
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer mock_token_for_development'
                    },
                    body: formData
                });

                // Debug Log: Response received
                console.log('[ImageAnalysisService] Response status:', response.status);

                const data = await response.json();

                // Clean up temporary files after API request is complete
                try {
                    await FileSystem.deleteAsync(tempUri, { idempotent: true });
                    await FileSystem.deleteAsync(compressedImage.uri, { idempotent: true });
                } catch (cleanupError) {
                    console.warn('[ImageAnalysisService] Error cleaning up temporary files:', cleanupError);
                    // Don't throw - cleanup errors shouldn't affect the main flow
                }

                // Debug Log: Response details
                console.log('[ImageAnalysisService] Response data:', {
                    status: response.status,
                    success: data.success,
                    message: data.message,
                    foodId: data.data?.food?.id,
                    foodName: data.data?.food?.food_name,
                    errorDetails: !data.success ? data : null
                });

                // Handle HTTP errors
                if (!response.ok) {
                    console.error('[ImageAnalysisService] HTTP Error:', {
                        status: response.status,
                        message: data.message
                    });
                    throw new Error(data.message || `HTTP Error: ${response.status}`);
                }

                // Handle API errors
                if (!data.success) {
                    console.error('[ImageAnalysisService] API Error:', data.message);
                    throw new Error(data.message || 'Image analysis failed');
                }

                // Validate response data
                if (!data.data?.food) {
                    console.error('[ImageAnalysisService] Invalid response: missing food data');
                    throw new Error('Invalid response format: missing food data');
                }

                // Fix NaN values in nutrition data
                if (data.data.food) {
                    const food = data.data.food;
                    food.total_protein = isNaN(food.total_protein) ? 0 : food.total_protein;
                    food.total_carb = isNaN(food.total_carb) ? 0 : food.total_carb;
                    food.total_fat = isNaN(food.total_fat) ? 0 : food.total_fat;
                    food.total_fiber = isNaN(food.total_fiber) ? 0 : food.total_fiber;
                    food.total_calorie = isNaN(food.total_calorie) ? 0 : food.total_calorie;

                    // Debug Log: Nutrition values
                    console.log('[ImageAnalysisService] Sanitized nutrition values:', {
                        protein: food.total_protein,
                        carbs: food.total_carb,
                        fat: food.total_fat,
                        fiber: food.total_fiber,
                        calories: food.total_calorie
                    });
                }

                return data;
            } catch (error) {
                console.error('[ImageAnalysisService] Error processing image:', {
                    error: error instanceof Error ? error.message : String(error),
                    imageLength: base64Image?.length || 0,
                    hasDataUrl: base64Image?.startsWith('data:') || false
                });
                throw new Error('Failed to process image data: ' + (error instanceof Error ? error.message : 'Unknown error'));
            }
        } catch (error: any) {
            // Detailed error logging
            console.error('[ImageAnalysisService] Error:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });

            throw error;
        }
    }
};
