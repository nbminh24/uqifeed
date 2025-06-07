import { Food } from '@/types/food';
import { getApiUrl } from '../constants/Config';

interface GenerateFoodRequest {
    food_name: string;
    ingredients: Array<{
        ingredient_name: string;
        ingredient_amount: string | number;
    }>;
    meal_type_id: string;
}

interface GenerateFoodResponse {
    success: boolean;
    message: string;
    data: {
        food: Food;
        foodIngredientList: Array<{
            'Ingredient Name': string;
            'Ingredient Amount': string;
            'Ingredient Description': Record<string, string>;
            'Ingredient Protein': string;
            'Ingredient Carb': string;
            'Ingredient Fat': string;
            'Ingredient Fiber': string;
        }>;
    };
}

class FoodGenerationService {
    private baseUrl: string; constructor() {
        this.baseUrl = getApiUrl('');
    }

    async generateFood(request: GenerateFoodRequest): Promise<GenerateFoodResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/text-food/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('[FoodGenerationService] Generate food error:', error);
            throw error;
        }
    } async updateFood(foodId: string, request: GenerateFoodRequest): Promise<GenerateFoodResponse> {
        try {
            // Convert the request format from food generator format to text food format
            const ingredients_text = request.ingredients
                .map(ing => `${ing.ingredient_amount}g ${ing.ingredient_name}`)
                .join(', ');
            const textDescription = `${request.food_name}. Ingredients: ${ingredients_text}`;

            const response = await fetch(`${this.baseUrl}/api/text-food/${foodId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    textDescription,
                    meal_type_id: request.meal_type_id
                }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('[FoodGenerationService] Update food error:', error);
            throw error;
        }
    }
}

export const foodGenerationService = new FoodGenerationService();
