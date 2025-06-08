import { API_URL } from '@/constants/Config';

export interface NutritionSummary {
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    total_fiber: number;
}

export const nutritionSummaryService = {
    async getDailySummary(date: string): Promise<NutritionSummary> {
        try {
            const response = await fetch(`${API_URL}/nutrition-summary?date=${date}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch nutrition summary');
            }

            const data = await response.json();
            if (data.success && data.data) {
                // Extract data from success response
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch nutrition summary');
            }
        } catch (error) {
            console.error('Error fetching nutrition summary:', error);
            // Return zeros if there's an error
            return {
                total_calories: 0,
                total_protein: 0,
                total_carbs: 0,
                total_fat: 0,
                total_fiber: 0,
            };
        }
    }
};