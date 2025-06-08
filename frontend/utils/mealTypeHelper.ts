// Helper function to convert meal_type_id to meal type string
export const getMealTypeString = (mealTypeId?: number | string): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
    if (!mealTypeId) return 'breakfast'; // Default to breakfast

    const id = typeof mealTypeId === 'string' ? parseInt(mealTypeId) : mealTypeId;
    switch (id) {
        case 1: return 'breakfast';
        case 2: return 'lunch';
        case 3: return 'dinner';
        case 4: return 'snack';
        default: return 'breakfast';
    }
};
