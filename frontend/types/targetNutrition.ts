export interface TargetNutrition {
    id: string;
    userId: string;
    daily: {
        calories: number;
        protein: number;
        fat: number;
        carbs: number;
        fiber: number;
    };
    meals?: {
        breakfast: {
            calories: number;
            protein: number;
            fat: number;
            carbs: number;
            fiber: number;
        };
        lunch: {
            calories: number;
            protein: number;
            fat: number;
            carbs: number;
            fiber: number;
        };
        dinner: {
            calories: number;
            protein: number;
            fat: number;
            carbs: number;
            fiber: number;
        };
        snack: {
            calories: number;
            protein: number;
            fat: number;
            carbs: number;
            fiber: number;
        };
    };
    createdAt: string;
    updatedAt: string;
}
