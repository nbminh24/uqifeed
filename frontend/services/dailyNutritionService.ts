import { API_URL } from '../constants/Config';

export interface NutritionData {
    current: number;
    target: number;
    percentage: number;
}

export interface DailyNutritionSummary {
    calories: NutritionData;
    proteins: NutritionData;
    fats: NutritionData;
    carbs: NutritionData;
}

export interface DailyNutritionResponse {
    success: boolean;
    data: DailyNutritionSummary;
    message?: string;
}

export interface DailyNutritionItem {
    id: string;
    userId: string;
    date: string;
    calories: number;
    proteins: number;
    fats: number;
    carbs: number;
    createdAt: string;
    updatedAt: string;
}

export interface DailyNutritionRangeResponse {
    success: boolean;
    data: DailyNutritionItem[];
}

export const getDailyNutrition = async (date: string): Promise<DailyNutritionSummary> => {
    try {
        console.log(`Fetching daily nutrition for date: ${date}`);
        const response = await fetch(
            `${API_URL}/api/daily-nutrition?date=${date}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer mock_token_for_development'
                }
            }
        );

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            console.error(`Failed response: ${response.status} ${response.statusText}`);
            throw new Error('Failed to fetch daily nutrition');
        }

        const data: DailyNutritionResponse = await response.json();
        console.log('Response data:', data);

        if (!data.success) {
            console.error('API reported failure:', data);
            throw new Error(data.message || 'Failed to get daily nutrition summary');
        } return data.data;
    } catch (error) {
        console.error('Error fetching daily nutrition:', error);
        // Return default data instead of throwing
        return {
            calories: { current: 0, target: 2000, percentage: 0 },
            proteins: { current: 0, target: 80, percentage: 0 },
            fats: { current: 0, target: 80, percentage: 0 },
            carbs: { current: 0, target: 150, percentage: 0 }
        };
    }
};

/**
 * Get daily nutrition data for a date range
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @returns Array of daily nutrition items
 */
export const getDailyNutritionRange = async (
    startDate: string,
    endDate: string
): Promise<DailyNutritionItem[]> => {
    try {
        console.log(`Fetching daily nutrition range from ${startDate} to ${endDate}`);
        const response = await fetch(
            `${API_URL}/api/daily-nutrition/range?startDate=${startDate}&endDate=${endDate}`,
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
            console.error(`Failed response: ${response.status} ${response.statusText}`);
            throw new Error('Failed to fetch daily nutrition range');
        }

        const data: DailyNutritionRangeResponse = await response.json();

        if (!data.success) {
            throw new Error('Failed to get daily nutrition range');
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching daily nutrition range:', error);
        return [];
    }
};

/**
 * Update daily nutrition data for a specific date
 * @param date Date in YYYY-MM-DD format
 * @returns Updated daily nutrition data
 */
export const updateDailyNutrition = async (date: string): Promise<DailyNutritionItem | null> => {
    try {
        console.log(`Updating daily nutrition for date: ${date}`);
        const response = await fetch(
            `${API_URL}/api/daily-nutrition/update`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer mock_token_for_development'
                },
                body: JSON.stringify({ date })
            }
        );

        if (!response.ok) {
            throw new Error('Failed to update daily nutrition');
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to update daily nutrition');
        }

        return data.data;
    } catch (error) {
        console.error('Error updating daily nutrition:', error);
        return null;
    }
};
