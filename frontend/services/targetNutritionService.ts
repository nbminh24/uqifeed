import { API_URL } from '@/constants/Config';
import { TargetNutrition } from '@/types/targetNutrition';

const DEFAULT_TARGET: TargetNutrition = {
    id: 'default',
    userId: 'default',
    daily: {
        calories: 2000,
        protein: 50,
        fat: 70,
        carbs: 260,
        fiber: 25
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const targetNutritionService = {
    async getTargetNutrition(): Promise<TargetNutrition> {
        try {
            const response = await fetch(`${API_URL}/target-nutrition`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch target nutrition');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching target nutrition:', error);
            // Return default values if there's an error
            return DEFAULT_TARGET;
        }
    }
};
