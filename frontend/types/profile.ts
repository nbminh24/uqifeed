export type Gender = 'Male' | 'Female';

export type ActivityLevel =
    | 'Sedentary'
    | 'Lightly active'
    | 'Moderately active'
    | 'Very active'
    | 'Extra active';

export type WeightGoal =
    | 'Lose weight'
    | 'Maintain weight'
    | 'Gain weight';

export type DietType =
    | 'Balanced'
    | 'Vegetarian'
    | 'Vegan'
    | 'Paleo'
    | 'Keto'
    | 'High Protein'
    | 'Low Carb'
    | 'Standard';

export interface Profile {
    id: string;
    userId: string;
    gender: Gender;
    birthday: string; // ISO date string
    height: number | null;
    currentWeight: number | null;
    targetWeight: number | null;
    target_time: string; // ISO date string
    activityLevel: ActivityLevel;
    goal: WeightGoal;
    dietType: DietType;
    createdAt?: string;
    updatedAt?: string;
}
