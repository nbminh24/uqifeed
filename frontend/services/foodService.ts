import { getApiUrl } from '../constants/Config';
import { DetailedFoodResponse } from '../types/food';

export const foodService = {
    getDetailedFood: async (foodId: string): Promise<DetailedFoodResponse> => {
        try {
            const response = await fetch(getApiUrl(`/api/foods/${foodId}/detailed`));
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching detailed food:', error);
            throw error;
        }
    }
};
