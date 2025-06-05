import { API_URL } from '../constants/Config';

export interface FoodHistoryItem {
    id: string;
    name: string;
    calories: number;
    nutritionScore: number;
    mealTime: string;
    imageUrl?: string;
    carbs: number;
    fats: number;
    proteins: number;
}

export interface FoodHistoryByDate {
    [date: string]: FoodHistoryItem[];
}

export interface FoodHistoryResponse {
    success: boolean;
    message: string;
    data: {
        foodsByDate: FoodHistoryByDate;
    };
}

export const getFoodHistory = async (startDate: string, endDate: string): Promise<FoodHistoryByDate> => {
    try {
        const response = await fetch(
            `${API_URL}/api/food-history?startDate=${startDate}&endDate=${endDate}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer mock_token_for_development'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch food history');
        }

        const data: FoodHistoryResponse = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch food history');
        }        // If no data returned, return an empty object
        if (!data.data?.foodsByDate) {
            console.log('No food history data found, returning empty object');
            return {};
        }

        return data.data.foodsByDate;
    } catch (error) {
        console.error('Error fetching food history:', error);
        // Return empty object instead of throwing on error
        return {};
    }
};
