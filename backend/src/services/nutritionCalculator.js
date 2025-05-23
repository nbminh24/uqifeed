/**
 * Nutrition Calculator Service
 * Calculates nutrition targets based on user profile
 */

// Constants for nutrition calculations
const CALORIES_PER_GRAM = {
    PROTEIN: 4,    // 4 calories per gram of protein
    CARBS: 4,      // 4 calories per gram of carbs
    FAT: 9         // 9 calories per gram of fat
};

// Activity level multipliers
const ACTIVITY_MULTIPLIERS = {
    'Sedentary': 1.2,              // Little or no exercise
    'Lightly active': 1.375,       // Light exercise 1-3 days/week
    'Moderately active': 1.55,     // Moderate exercise 3-5 days/week
    'Very active': 1.725,          // Hard exercise 6-7 days/week
    'Extra active': 1.9            // Very hard exercise & physical job or training twice a day
};

// Diet type macro distributions (in percentages)
const DIET_MACRO_RATIOS = {
    'Balanced': { carbs: 50, protein: 20, fat: 30 },
    'Vegetarian': { carbs: 55, protein: 15, fat: 30 },
    'Vegan': { carbs: 60, protein: 15, fat: 25 },
    'Paleo': { carbs: 30, protein: 30, fat: 40 },
    'Keto': { carbs: 5, protein: 20, fat: 75 },
    'High Protein': { carbs: 25, protein: 35, fat: 40 },
    'Low Carb': { carbs: 20, protein: 30, fat: 50 },
    'Standard': { carbs: 50, protein: 20, fat: 30 }
};

// Fiber requirements by age and gender (grams per day)
const FIBER_REQUIREMENTS = {
    male: {
        '1-3': 19,
        '4-8': 25,
        '9-13': 26,
        '14-18': 38,
        '18-50': 38,
        '50+': 30
    },
    female: {
        '1-3': 19,
        '4-8': 25,
        '9-13': 24,
        '14-18': 26,
        '18-50': 25,
        '50+': 21
    }
};

// Meal distribution percentages
const MEAL_DISTRIBUTION = {
    standard: {
        breakfast: 0.25, // 25% of daily total
        lunch: 0.35,     // 35% of daily total
        dinner: 0.30,    // 30% of daily total
        snack: 0.10      // 10% of daily total
    },
    weightLoss: {
        breakfast: 0.30, // Larger breakfast
        lunch: 0.35,
        dinner: 0.25,    // Smaller dinner
        snack: 0.10
    },
    weightGain: {
        breakfast: 0.25,
        lunch: 0.30,
        dinner: 0.30,
        snack: 0.15      // More calories in snacks
    }
};

class NutritionCalculator {
    /**
     * Calculate BMR (Basal Metabolic Rate) using Harris-Benedict formula
     * @param {Object} profile - User profile data
     * @returns {Number} BMR value
     */
    static calculateBMR(profile) {
        const { gender, height, currentWeight } = profile;
        
        // Extract birthday from profile and calculate age
        const birthDate = new Date(profile.birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Use Harris-Benedict formula to calculate BMR
        if (gender === 'Male') {
            return 88.362 + (13.397 * currentWeight) + (4.799 * height) - (5.677 * age);
        } else { // Female
            return 447.593 + (9.247 * currentWeight) + (3.098 * height) - (4.330 * age);
        }
    }

    /**
     * Calculate TDEE (Total Daily Energy Expenditure)
     * @param {Number} bmr - Basal Metabolic Rate
     * @param {String} activityLevel - User's activity level
     * @returns {Number} TDEE value
     */
    static calculateBaseTDEE(bmr, activityLevel) {
        const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS['Moderately active'];
        return bmr * activityMultiplier;
    }

    /**
     * Calculate TDEE adjustment based on weight goals
     * @param {Object} profile - User profile data
     * @returns {Number} Daily calorie adjustment
     */
    static calculateTDEEAdjustment(profile) {
        const { currentWeight, targetWeight } = profile;
        
        // Extract target time from profile and calculate weeks
        const targetDate = new Date(profile.targetTime);
        const today = new Date();
        const timeDiff = targetDate.getTime() - today.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        const goalDurationWeeks = Math.max(1, Math.ceil(daysDiff / 7)); // At least 1 week
        
        // Each kg of weight change requires approximately 7700 calories
        const weightDifference = targetWeight - currentWeight;
        return (weightDifference * 7700) / (goalDurationWeeks * 7);
    }

    /**
     * Calculate final TDEE with goal adjustment
     * @param {Number} baseTDEE - Base TDEE
     * @param {Number} adjustment - Calorie adjustment
     * @returns {Number} Adjusted TDEE
     */
    static calculateFinalTDEE(baseTDEE, adjustment) {
        return Math.max(1200, baseTDEE + adjustment); // Minimum 1200 calories for safety
    }

    /**
     * Calculate required fiber based on age and gender
     * @param {Object} profile - User profile data
     * @returns {Number} Daily fiber requirement in grams
     */
    static calculateFiber(profile) {
        const { gender } = profile;
        const genderKey = gender === 'Male' ? 'male' : 'female';
        
        // Extract birthday from profile and calculate age
        const birthDate = new Date(profile.birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        
        // Determine age category
        let ageCategory;
        if (age < 4) ageCategory = '1-3';
        else if (age < 9) ageCategory = '4-8';
        else if (age < 14) ageCategory = '9-13';
        else if (age < 19) ageCategory = '14-18';
        else if (age < 51) ageCategory = '18-50';
        else ageCategory = '50+';
        
        return FIBER_REQUIREMENTS[genderKey][ageCategory];
    }

    /**
     * Calculate macronutrient distribution based on diet type
     * @param {Number} tdee - Total Daily Energy Expenditure
     * @param {String} dietType - User's diet type
     * @returns {Object} Macronutrient breakdown
     */
    static calculateMacros(tdee, dietType) {
        // Get macro ratios for the diet type or use balanced as default
        const macroRatios = DIET_MACRO_RATIOS[dietType] || DIET_MACRO_RATIOS['Balanced'];
        
        // Calculate calories from each macro
        const carbCalories = tdee * (macroRatios.carbs / 100);
        const proteinCalories = tdee * (macroRatios.protein / 100);
        const fatCalories = tdee * (macroRatios.fat / 100);
        
        // Convert calories to grams
        return {
            carbs: Math.round(carbCalories / CALORIES_PER_GRAM.CARBS),
            protein: Math.round(proteinCalories / CALORIES_PER_GRAM.PROTEIN),
            fat: Math.round(fatCalories / CALORIES_PER_GRAM.FAT)
        };
    }

    /**
     * Calculate meal distribution of macros and calories
     * @param {Object} macros - Daily macronutrients
     * @param {Number} tdee - Total Daily Energy Expenditure
     * @param {Number} fiber - Daily fiber requirement
     * @param {String} goal - User's weight goal
     * @returns {Object} Nutrition breakdown by meal
     */
    static calculateMealDistribution(macros, tdee, fiber, goal) {
        // Select meal distribution based on goal
        let distribution;
        if (goal === 'Lose weight') {
            distribution = MEAL_DISTRIBUTION.weightLoss;
        } else if (goal === 'Gain weight') {
            distribution = MEAL_DISTRIBUTION.weightGain;
        } else {
            distribution = MEAL_DISTRIBUTION.standard;
        }
        
        // Create meal plan
        const mealPlan = {
            breakfast: {
                calories: Math.round(tdee * distribution.breakfast),
                carbs: Math.round(macros.carbs * distribution.breakfast),
                protein: Math.round(macros.protein * distribution.breakfast),
                fat: Math.round(macros.fat * distribution.breakfast),
                fiber: Math.round(fiber * distribution.breakfast)
            },
            lunch: {
                calories: Math.round(tdee * distribution.lunch),
                carbs: Math.round(macros.carbs * distribution.lunch),
                protein: Math.round(macros.protein * distribution.lunch),
                fat: Math.round(macros.fat * distribution.lunch),
                fiber: Math.round(fiber * distribution.lunch)
            },
            dinner: {
                calories: Math.round(tdee * distribution.dinner),
                carbs: Math.round(macros.carbs * distribution.dinner),
                protein: Math.round(macros.protein * distribution.dinner),
                fat: Math.round(macros.fat * distribution.dinner),
                fiber: Math.round(fiber * distribution.dinner)
            },
            snack: {
                calories: Math.round(tdee * distribution.snack),
                carbs: Math.round(macros.carbs * distribution.snack),
                protein: Math.round(macros.protein * distribution.snack),
                fat: Math.round(macros.fat * distribution.snack),
                fiber: Math.round(fiber * distribution.snack)
            }
        };
        
        return mealPlan;
    }

    /**
     * Calculate complete nutrition targets for a user based on their profile
     * @param {Object} profile - User profile data
     * @returns {Object} Complete nutrition targets
     */
    static calculateNutritionTargets(profile) {
        // Step 1: Calculate BMR
        const bmr = this.calculateBMR(profile);
        
        // Step 2: Calculate base TDEE
        const baseTDEE = this.calculateBaseTDEE(bmr, profile.activityLevel);
        
        // Step 3: Calculate TDEE adjustment based on goals
        const adjustment = this.calculateTDEEAdjustment(profile);
        
        // Step 4: Calculate final TDEE
        const finalTDEE = this.calculateFinalTDEE(baseTDEE, adjustment);
        
        // Step 5: Calculate macronutrient distribution
        const macros = this.calculateMacros(finalTDEE, profile.dietType);
        
        // Step 6: Calculate fiber requirement
        const fiber = this.calculateFiber(profile);
        
        // Step 7: Calculate meal distribution
        const mealPlan = this.calculateMealDistribution(macros, finalTDEE, fiber, profile.goal);
        
        // Return complete nutrition targets
        return {
            daily: {
                calories: Math.round(finalTDEE),
                carbs: macros.carbs,
                protein: macros.protein,
                fat: macros.fat,
                fiber: fiber
            },
            meals: mealPlan,
            calculations: {
                bmr: Math.round(bmr),
                baseTDEE: Math.round(baseTDEE),
                adjustment: Math.round(adjustment)
            }
        };
    }
}

module.exports = NutritionCalculator;
