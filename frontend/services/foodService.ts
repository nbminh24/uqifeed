import { getApiUrl } from '../constants/Config';
import { DetailedFoodResponse } from '../types/food';

interface DeleteFoodResponse {
    success: boolean;
    message: string;
    data?: null;
}

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
    },

    deleteFood: async (foodId: string): Promise<DeleteFoodResponse> => {
        try {
            console.log('[FoodService] Deleting food with ID:', foodId);
            const response = await fetch(getApiUrl(`/api/foods/${foodId}`), {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('[FoodService] Delete API Error:', data);
                throw new Error(data.message || `Failed to delete food (${response.status})`);
            }

            console.log('[FoodService] Successfully deleted food');
            return data;
        } catch (error) {
            console.error('[FoodService] Delete Error:', error);
            throw error;
        }
    }
};
