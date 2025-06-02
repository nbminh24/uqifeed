import { getApiUrl } from '../constants/Config';
import { DetailedFoodResponse } from '../types/food';

export const foodService = {
    getDetailedFood: async (foodId: string): Promise<DetailedFoodResponse> => {
        try {
            console.log('[FoodService] Fetching food details for ID:', foodId);
            const response = await fetch(getApiUrl(`/api/foods/${foodId}/detailed`), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('[FoodService] API Error:', data);
                throw new Error(data.message || `Failed to fetch food details (${response.status})`);
            }

            console.log('[FoodService] Successfully fetched food details');
            return data;
        } catch (error) {
            console.error('[FoodService] Error:', error);
            throw error;
        }
    }
};
