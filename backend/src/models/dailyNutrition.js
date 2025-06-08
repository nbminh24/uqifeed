const { db } = require('../config/firebase');

// Collection reference
const dailyNutritionCollection = db.collection('daily_nutrition');

/**
 * Daily Nutrition Model
 * Stores the total daily nutrition values for a user on a specific date
 */
class DailyNutrition {
    /**
     * Create or update a daily nutrition record
     * @param {Object} data - Daily nutrition data
     * @returns {Object} Created/updated daily nutrition object
     */
    static async createOrUpdate(data) {
        try {
            if (!data.userId || !data.date) {
                throw new Error('userId and date are required');
            }

            // Format: userId_YYYY-MM-DD
            const documentId = `${data.userId}_${data.date}`;

            // Add timestamps
            data.updatedAt = new Date().toISOString();

            // Check if record already exists
            const existingDoc = await dailyNutritionCollection.doc(documentId).get();

            if (existingDoc.exists) {
                // Update existing record
                await dailyNutritionCollection.doc(documentId).update({
                    ...data,
                    updatedAt: data.updatedAt
                });
            } else {
                // Create new record
                data.createdAt = new Date().toISOString();
                await dailyNutritionCollection.doc(documentId).set(data);
            }

            // Get the updated document
            const updatedDoc = await dailyNutritionCollection.doc(documentId).get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        } catch (error) {
            console.error('Error creating/updating daily nutrition:', error);
            throw error;
        }
    }

    /**
     * Find daily nutrition by user ID and date
     * @param {String} userId - User ID
     * @param {String} date - Date in YYYY-MM-DD format
     * @returns {Object|null} Daily nutrition object or null if not found
     */
    static async findByUserIdAndDate(userId, date) {
        try {
            // Format: userId_YYYY-MM-DD
            const documentId = `${userId}_${date}`;

            const doc = await dailyNutritionCollection.doc(documentId).get();

            if (!doc.exists) {
                return null;
            }

            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error('Error finding daily nutrition:', error);
            throw error;
        }
    }

    /**
     * Find daily nutrition records by user ID for a date range
     * @param {String} userId - User ID
     * @param {String} startDate - Start date in YYYY-MM-DD format
     * @param {String} endDate - End date in YYYY-MM-DD format
     * @returns {Array} Array of daily nutrition objects
     */
    static async findByUserIdAndDateRange(userId, startDate, endDate) {
        try {
            // Convert dates to timestamps for comparison
            const startKey = `${userId}_${startDate}`;
            const endKey = `${userId}_${endDate}`;

            const snapshot = await dailyNutritionCollection
                .where('userId', '==', userId)
                .where('date', '>=', startDate)
                .where('date', '<=', endDate)
                .get();

            const results = [];
            snapshot.forEach(doc => {
                results.push({ id: doc.id, ...doc.data() });
            });

            return results;
        } catch (error) {
            console.error('Error finding daily nutrition by date range:', error);
            throw error;
        }
    }    /**
     * Calculate and store daily nutrition totals from food history
     * @param {String} userId - User ID
     * @param {String} date - Date in YYYY-MM-DD format
     * @param {Array} foods - Array of food items for the day
     * @returns {Object} Daily nutrition object
     */
    static async calculateAndStoreDailyTotals(userId, date, foods) {
        try {
            console.log(`Calculating nutrition totals for user ${userId} on date ${date} with ${foods.length} foods`);
            
            // Calculate total nutrients
            const totalNutrition = foods.reduce((acc, food) => {
                // Extract nutrition values, ensuring they're numbers
                const calories = Number(food.calories || 0);
                const proteins = Number(food.proteins || 0);
                const fats = Number(food.fats || 0);
                const carbs = Number(food.carbs || 0);
                
                console.log(`Adding food "${food.name}": calories=${calories}, proteins=${proteins}, fats=${fats}, carbs=${carbs}`);
                
                return {
                    calories: acc.calories + calories,
                    proteins: acc.proteins + proteins,
                    fats: acc.fats + fats,
                    carbs: acc.carbs + carbs
                };
            }, { calories: 0, proteins: 0, fats: 0, carbs: 0 });

            console.log(`Total nutrition calculated: ${JSON.stringify(totalNutrition)}`);
            
            // Store the calculated totals
            const dailyNutritionData = {
                userId,
                date,
                ...totalNutrition,
                foodCount: foods.length, // Store the number of foods for reference
                foodIds: foods.map(food => food.id) // Store food IDs for reference
            };

            return await this.createOrUpdate(dailyNutritionData);
        } catch (error) {
            console.error('Error calculating daily nutrition totals:', error);
            throw error;
        }
    }
}

module.exports = DailyNutrition;
