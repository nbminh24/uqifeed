/**
 * Utility functions for nutrition calculations
 */

/**
 * Calculate and round calories to whole number
 * 
 * @param {number} protein - Protein in grams
 * @param {number} carb - Carbohydrates in grams
 * @param {number} fat - Fat in grams
 * @returns {number} - Calories rounded to whole number
 */
const calculateCalories = (protein, carb, fat) => {
    // Calculate calories: 4 calories per gram of protein, 4 per gram of carbs, 9 per gram of fat
    const calories = (protein * 4) + (carb * 4) + (fat * 9);
    // Round calories to 0 decimal places (whole number)
    return Math.round(calories);
};

module.exports = {
    calculateCalories
};
