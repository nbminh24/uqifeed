// Helper functions for meal type data manipulation
import { MealType } from '@/services/mealTypeService';

export interface NormalizedMealType extends MealType {
    originalId: string;
}

export const normalizeMealType = (mealType: MealType): NormalizedMealType => {
    return {
        ...mealType,
        originalId: mealType.id
    };
};

export const normalizeMealTypes = (mealTypes: MealType[]): NormalizedMealType[] => {
    return mealTypes.map(normalizeMealType);
};
