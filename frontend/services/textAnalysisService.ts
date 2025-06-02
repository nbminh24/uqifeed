import { getApiUrl } from '../constants/Config';

interface TextAnalysisResponse {
    success: boolean;
    message: string;
    data: {
        food: {
            id: string;
            food_name: string;
            food_text_description: string;
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
        nutritionScore: any;
        nutritionComments: Array<any>;
        targetNutrition: any | null;
    };
}

export const textAnalysisService = {
    analyzeText: async (text: string, mealTypeId: string): Promise<TextAnalysisResponse> => {
        try {
            const url = getApiUrl('/api/one-stop-text-analysis');
            console.log('[TextAnalysisService] Making request to:', url, 'with meal type:', mealTypeId); const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer mock_token_for_development'
                },
                body: JSON.stringify({
                    textDescription: text,
                    meal_type_id: mealTypeId
                })
            }); const data = await response.json();
            console.log('[TextAnalysisService] Response:', {
                status: response.status,
                ok: response.ok,
                data: data
            });

            // Check if response is not ok (HTTP error)
            if (!response.ok) {
                throw new Error(data.message || `HTTP Error: ${response.status}`);
            }

            // Check if response indicates success
            if (!data.success) {
                throw new Error(data.message || 'Analysis failed');
            }

            // Validate required data
            if (!data.data?.food) {
                throw new Error('Invalid response format: missing food data');
            }

            // If data is successful but contains NaN values for nutrition, fix them
            if (data.success && data.data?.food) {
                const food = data.data.food;

                // Ensure all nutrition values are valid numbers
                food.total_protein = isNaN(food.total_protein) ? 0 : food.total_protein;
                food.total_carb = isNaN(food.total_carb) ? 0 : food.total_carb;
                food.total_fat = isNaN(food.total_fat) ? 0 : food.total_fat;
                food.total_fiber = isNaN(food.total_fiber) ? 0 : food.total_fiber;
                food.total_calorie = isNaN(food.total_calorie) ? 0 : food.total_calorie;

                console.log('[TextAnalysisService] Sanitized nutrition values:', {
                    protein: food.total_protein,
                    carbs: food.total_carb,
                    fat: food.total_fat,
                    fiber: food.total_fiber,
                    calories: food.total_calorie
                });
            }

            return data;
        } catch (error: any) {
            console.error('[TextAnalysisService] Error:', error);
            throw new Error(error.message || 'Could not analyze the text. Please try again');
        }
    },
};
