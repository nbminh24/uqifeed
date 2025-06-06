export interface AnalysisIngredient {
    'Ingredient Name': string;
    'Ingredient Amount': string;
    'Ingredient Protein': string;
    'Ingredient Carb': string;
    'Ingredient Fat': string;
    'Ingredient Fiber': string;
    'Ingredient Description': Record<string, string>;
}

export interface TextAnalysisResponse {
    success: boolean;
    data: {
        food: {
            id: string;
            food_name: string;
            food_text_description: string;
            food_description: Record<string, string>;
            food_advice: Record<string, string>;
            food_preparation: Record<string, any>; cloudinary_public_id: string;
            food_image: string;
            total_calorie: number;
            total_protein: number;
            total_fat: number;
            total_carb: number;
            total_fiber: number;
            foodIngredientList: AnalysisIngredient[];
            meal_type_id?: string;
            created_at: string;
            updated_at: string;
        }
    }
}
