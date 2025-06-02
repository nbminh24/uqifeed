import { getApiUrl } from '../constants/Config';

export interface MealType {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

interface MealTypesResponse {
    success: boolean;
    message: string;
    data: {
        mealTypes: MealType[];
    };
}

export const mealTypeService = {
    getAllMealTypes: async (): Promise<MealTypesResponse> => {
        try {
            const url = getApiUrl('/api/meal-types');
            console.log('[MealTypeService] Fetching meal types from:', url);

            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('[MealTypeService] API Error:', data);
                throw new Error(data.message || `Failed to fetch meal types (${response.status})`);
            }

            console.log('[MealTypeService] Successfully fetched meal types');
            return data;
        } catch (error) {
            console.error('[MealTypeService] Error:', error);
            throw error;
        }
    }
};
