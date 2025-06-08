import { isValidDate } from '@/services/dateUtils';

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
    | 'Low-carb'
    | 'Keto';

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

export type ProfileUpdateInput = Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export const validateProfile = (profile: Profile): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!profile.gender) {
        errors.gender = 'Vui lòng chọn giới tính';
    }

    if (!profile.birthday || !isValidDate(profile.birthday)) {
        errors.birthday = 'Vui lòng chọn ngày sinh hợp lệ';
    }

    if (profile.height === null) {
        errors.height = 'Vui lòng nhập chiều cao';
    } else if (profile.height < 100 || profile.height > 250) {
        errors.height = 'Chiều cao phải từ 100cm đến 250cm';
    }

    if (profile.currentWeight === null) {
        errors.currentWeight = 'Vui lòng nhập cân nặng hiện tại';
    } else if (profile.currentWeight < 30 || profile.currentWeight > 300) {
        errors.currentWeight = 'Cân nặng phải từ 30kg đến 300kg';
    }

    if (profile.targetWeight === null) {
        errors.targetWeight = 'Vui lòng nhập cân nặng mục tiêu';
    } else if (profile.targetWeight < 30 || profile.targetWeight > 300) {
        errors.targetWeight = 'Cân nặng mục tiêu phải từ 30kg đến 300kg';
    }

    if (!profile.target_time) {
        errors.target_time = 'Vui lòng chọn ngày mục tiêu';
    } else {
        const targetDate = new Date(profile.target_time);
        const currentDate = new Date();

        if (!isValidDate(profile.target_time)) {
            errors.target_time = 'Ngày mục tiêu không hợp lệ';
        } else if (targetDate <= currentDate) {
            errors.target_time = 'Ngày mục tiêu phải là tương lai';
        }
    }

    return errors;
};
