const { db } = require('../config/firebase');

// Collection reference
const weeklyBMICollection = db.collection('weekly_bmi');

/**
 * Weekly BMI Model
 * Stores BMI and related measurements for users on a weekly basis
 */
class WeeklyBMI {
    /**
     * Create or update a weekly BMI record
     * @param {Object} data - Weekly BMI data
     * @returns {Object} Created/updated weekly BMI object
     */
    static async createOrUpdate(data) {
        try {
            if (!data.userId || !data.weekStart) {
                throw new Error('userId and weekStart are required');
            }

            // Format: userId_YYYY-MM-DD (using Monday as week start)
            const documentId = `${data.userId}_${data.weekStart}`;

            // Add timestamps
            data.updatedAt = new Date().toISOString();

            // Check if record already exists
            const existingDoc = await weeklyBMICollection.doc(documentId).get();

            if (existingDoc.exists) {
                // Update existing record
                await weeklyBMICollection.doc(documentId).update({
                    ...data,
                    updatedAt: data.updatedAt
                });
                return { id: documentId, ...data };
            } else {
                // Create new record
                data.createdAt = data.updatedAt;
                await weeklyBMICollection.doc(documentId).set(data);
                return { id: documentId, ...data };
            }
        } catch (error) {
            console.error('Error in createOrUpdate:', error);
            throw error;
        }
    }

    /**
     * Find weekly BMI by user ID and week start date
     * @param {String} userId - User ID
     * @param {String} weekStart - Week start date in YYYY-MM-DD format
     * @returns {Object|null} Weekly BMI object or null if not found
     */
    static async findByUserIdAndWeek(userId, weekStart) {
        try {
            const documentId = `${userId}_${weekStart}`;
            const doc = await weeklyBMICollection.doc(documentId).get();

            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error in findByUserIdAndWeek:', error);
            throw error;
        }
    }

    /**
     * Find weekly BMI records by user ID for a date range
     * @param {String} userId - User ID
     * @param {String} startDate - Start date in YYYY-MM-DD format
     * @param {String} endDate - End date in YYYY-MM-DD format
     * @returns {Array} Array of weekly BMI objects
     */    static async findByUserIdAndDateRange(userId, startDate, endDate) {
        try {
            console.log(`Finding BMI records for user ${userId} from ${startDate} to ${endDate}`);

            if (!userId || !startDate || !endDate) {
                throw new Error('Missing required parameters: userId, startDate, and endDate are required');
            }

            // Use the document ID format to query the range
            const startId = `${userId}_${startDate}`;
            const endId = `${userId}_${endDate}`;

            const snapshot = await weeklyBMICollection
                .where('__name__', '>=', startId)
                .where('__name__', '<=', endId)
                .get();

            const results = [];
            snapshot.forEach(doc => {
                results.push({ id: doc.id, ...doc.data() });
            });

            return results;
        } catch (error) {
            console.error('Error in findByUserIdAndDateRange:', error);
            throw error;
        }
    }

    /**
     * Calculate BMI
     * @param {Number} weight - Weight in kilograms
     * @param {Number} height - Height in meters
     * @returns {Number} BMI value
     */
    static calculateBMI(weight, height) {
        if (!weight || !height || height === 0) {
            return 0;
        }
        return weight / (height * height);
    }

    /**
     * Get BMI category
     * @param {Number} bmi - BMI value
     * @returns {Object} BMI category and description
     */
    static getBMICategory(bmi) {
        if (bmi < 18.5) {
            return {
                category: 'Underweight',
                description: 'BMI is below the healthy range'
            };
        } else if (bmi >= 18.5 && bmi < 24.9) {
            return {
                category: 'Normal',
                description: 'BMI is within the healthy range'
            };
        } else if (bmi >= 25 && bmi < 29.9) {
            return {
                category: 'Overweight',
                description: 'BMI is above the healthy range'
            };
        } else {
            return {
                category: 'Obese',
                description: 'BMI is significantly above the healthy range'
            };
        }
    }
}

module.exports = WeeklyBMI;
