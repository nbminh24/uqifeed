export interface Ingredient {
    id: string;
    food_id: string;
    ingredient_name: string;
    ingredient_amount: number;
    ingredient_description?: any;
    ingredient_protein?: number;
    ingredient_carb?: number;
    ingredient_fat?: number;
    ingredient_fiber?: number;
}

export interface NutritionComment {
    id: string;
    food_id: string;
    target_nutrition_id: string;
    nutrition_type: string;
    nutrition_delta: number;
    nutrition_comment: string;
    icon: string;
    meal_type: string;
}

export interface NutritionScore {
    id: string;
    food_id: string;
    target_nutrition_id: string;
    score: number;
    score_details: {
        interpretation: {
            rating: string;
            description: string;
        }; comparisons?: {
            calories: NutrientComparison;
            protein: NutrientComparison;
            fat: NutrientComparison;
            carbs: NutrientComparison;
            fiber: NutrientComparison;
        };
        nutritionalBalance?: {
            avgRatioDifference: number;
            totalFoodGrams: number;
            totalTargetGrams: number;
        };
    };
}

interface NutrientComparison {
    food: number;
    target: number;
    percentage: number;
    deviation: number;
    foodRatio?: number;
    targetRatio?: number;
    ratioDifference?: number;
}

export interface Food {
    id: string;
    user_id: string;
    meal_type_id: string;
    food_name: string;
    food_description: string | Record<string, string>;
    food_advice: string | Record<string, string>;
    food_preparation: string | Record<string, string>;
    food_image?: string;
    total_protein: number;
    total_carb: number;
    total_fat: number;
    total_fiber: number;
    total_calorie: number;
    created_at: string;
    updated_at: string;
}

import { TargetNutrition } from './targetNutrition';

export interface DetailedFoodResponse {
    success: boolean;
    message: string;
    data: {
        food: Food;
        ingredients: Ingredient[];
        nutritionComments: NutritionComment[];
        nutritionScore: NutritionScore;
        targetNutrition: TargetNutrition | null;
    };
}
