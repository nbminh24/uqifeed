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

/**
 * Extracts numeric value and unit from ingredient amount string.
 * @param {String} amountStr - The amount string to parse
 * @returns {Object} Extracted numeric value and unit, normalized to grams
 */
function parseAmount(amountStr) {
    if (!amountStr) return { value: 1, unit: 'g' }; // Default value

    // Convert Vietnamese units to standardized form
    const viUnits = {
        'muỗng canh': 'tbsp',
        'muỗng cafe': 'tsp',
        'muỗng cà phê': 'tsp',
        'chén': 'cup',
        'ly': 'cup',
        'cốc': 'cup',
    };

    // Standardized conversion rates to grams
    const unitConversions = {
        'g': 1,
        'gram': 1,
        'kg': 1000,
        'mg': 0.001,
        'oz': 28.3495,
        'lb': 453.592,
        'cup': 240, // Approximate for most ingredients
        'tbsp': 15,
        'tsp': 5,
        'ml': 1, // Assuming density close to water
        'l': 1000,
    };

    // Clean and standardize input
    let cleanStr = amountStr.toLowerCase().trim();
    for (const [vi, en] of Object.entries(viUnits)) {
        cleanStr = cleanStr.replace(vi, en);
    }

    // Extract number and unit
    const match = cleanStr.match(/([\d.,]+)\s*([a-z]+)?/);
    if (!match) return { value: 1, unit: 'g' };

    const value = parseFloat(match[1].replace(',', '.'));
    let unit = (match[2] || 'g').toLowerCase();

    // Convert to base unit (grams)
    const conversionRate = unitConversions[unit] || 1;
    return {
        value: value * conversionRate,
        originalValue: value,
        originalUnit: unit,
    };
}



module.exports = {
    calculateCalories,
    parseAmount
};
