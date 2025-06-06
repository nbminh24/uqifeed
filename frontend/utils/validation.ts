import { Profile } from '@/types/profile';
import { isValidDate } from '@/services/dateUtils';

export const validateProfile = (profile: Partial<Profile>): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Required fields check
    if (!profile.gender) {
        errors.gender = 'Gender is required';
    }

    if (!profile.birthday || !isValidDate(new Date(profile.birthday))) {
        errors.birthday = 'Valid birthday is required';
    }

    // Height validation
    if (profile.height !== null) {
        if (isNaN(profile.height) || profile.height < 100 || profile.height > 250) {
            errors.height = 'Height must be between 100cm and 250cm';
        }
    } else {
        errors.height = 'Height is required';
    }

    // Weight validations
    if (profile.currentWeight !== null) {
        if (isNaN(profile.currentWeight) || profile.currentWeight < 30 || profile.currentWeight > 300) {
            errors.currentWeight = 'Current weight must be between 30kg and 300kg';
        }
    } else {
        errors.currentWeight = 'Current weight is required';
    }

    if (profile.targetWeight !== null) {
        if (isNaN(profile.targetWeight) || profile.targetWeight < 30 || profile.targetWeight > 300) {
            errors.targetWeight = 'Target weight must be between 30kg and 300kg';
        }
        if (profile.currentWeight !== null) {
            const minWeight = profile.currentWeight * 0.5;
            const maxWeight = profile.currentWeight * 1.5;
            if (profile.targetWeight < minWeight || profile.targetWeight > maxWeight) {
                errors.targetWeight = 'Target weight should be within ±50% of current weight';
            }
        }
    } else {
        errors.targetWeight = 'Target weight is required';
    }    // Target date validation
    console.log('[Validation] Validating target_time:', profile.target_time);
    if (!profile.target_time) {
        errors.target_time = 'Target date is required';
    } else {
        try {
            const targetDate = new Date(profile.target_time);
            console.log('[Validation] Parsed target date:', targetDate);
            if (!isValidDate(targetDate)) {
                errors.target_time = 'Invalid target date format';
            } else {
                const currentDate = new Date();
                if (targetDate <= currentDate) {
                    errors.target_time = 'Target date must be in the future';
                }
            }
        } catch (error) {
            console.error('[Validation] Error parsing target date:', error);
            errors.target_time = 'Invalid target date format';
        }
    }

    // Activity level validation
    if (!profile.activityLevel || !['Sedentary', 'Lightly active', 'Moderately active', 'Very active', 'Extra active'].includes(profile.activityLevel)) {
        errors.activityLevel = 'Valid activity level is required';
    }

    // Goal validation
    if (!profile.goal || !['Lose weight', 'Maintain weight', 'Gain weight'].includes(profile.goal)) {
        errors.goal = 'Valid weight goal is required';
    }

    // Diet type validation
    if (!profile.dietType || !['Balanced', 'Vegetarian', 'Vegan', 'Low-carb', 'Keto'].includes(profile.dietType)) {
        errors.dietType = 'Valid diet type is required';
    }

    return errors;
};
