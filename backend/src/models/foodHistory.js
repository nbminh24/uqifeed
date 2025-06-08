const { db } = require('../config/firebase');

// Collection reference
const foodHistoryCollection = db.collection('food_history');

/**
 * Food History Model
 * Handles all database operations related to food history records
 */
class FoodHistory {    /**
     * Create a new food history record
     * @param {Object} foodData - Food history data to create
     * @returns {Object} Created food history object
     */
    static async create(foodData) {
        try {
            // Add timestamp
            foodData.createdAt = new Date().toISOString();

            // Ensure mealTime is a Firestore timestamp
            if (foodData.mealTime && !(foodData.mealTime instanceof Date)) {
                foodData.mealTime = new Date(foodData.mealTime);
            }

            // Ensure nutrition values are numbers
            foodData.calories = Number(foodData.calories || 0);
            foodData.proteins = Number(foodData.proteins || 0);
            foodData.fats = Number(foodData.fats || 0);
            foodData.carbs = Number(foodData.carbs || 0);

            console.log('Creating food history with data:', JSON.stringify(foodData));

            // Create food history in Firestore
            const foodRef = await foodHistoryCollection.add(foodData);

            // Get the food history data with ID
            const food = await foodRef.get();
            return { id: food.id, ...food.data() };
        } catch (error) {
            console.error('Error creating food history:', error);
            throw error;
        }
    }

    /**
     * Find a food history by ID
     * @param {String} id - Food history ID
     * @returns {Object|null} Food history object or null if not found
     */
    static async findById(id) {
        try {
            const foodDoc = await foodHistoryCollection.doc(id).get();

            if (!foodDoc.exists) {
                return null;
            }

            return { id: foodDoc.id, ...foodDoc.data() };
        } catch (error) {
            console.error('Error finding food history by ID:', error);
            throw error;
        }
    }

    /**
     * Find food history records by user ID
     * @param {String} userId - User ID
     * @returns {Array} Array of food history objects
     */
    static async findByUserId(userId) {
        try {
            const snapshot = await foodHistoryCollection
                .where('userId', '==', userId)
                .orderBy('mealTime', 'desc')
                .get();

            const foods = [];
            snapshot.forEach(doc => {
                foods.push({ id: doc.id, ...doc.data() });
            });

            return foods;
        } catch (error) {
            console.error('Error finding food history by user ID:', error);
            throw error;
        }
    }    /**
     * Find food history records by date range
     * @param {String} userId - User ID
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Array of food history objects
     */    static async findByDateRange(userId, startDate, endDate) {
        try {
            console.log('findByDateRange called with:', {
                userId,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });

            // First try with the optimal query that requires an index
            try {
                console.log('Trying optimal query with index...');
                const snapshot = await foodHistoryCollection
                    .where('userId', '==', userId)
                    .where('mealTime', '>=', startDate)
                    .where('mealTime', '<=', endDate)
                    .orderBy('mealTime', 'asc')
                    .get();

                console.log('Query succeeded, documents found:', snapshot.size);

                const foods = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    console.log('Document data:', JSON.stringify(data));
                    foods.push({ id: doc.id, ...data });
                });

                return foods;
            } catch (indexError) {
                // If index error occurs, fall back to a less efficient but working query
                console.log('Index error, falling back to alternative query:', indexError.message);                // Get all foods for the user
                console.log('Using fallback query to get all foods for user');
                const snapshot = await foodHistoryCollection
                    .where('userId', '==', userId)
                    .get();

                console.log('Fallback query returned documents:', snapshot.size);

                // Filter in memory
                const foods = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    console.log('Processing document:', doc.id);
                    console.log('Document data:', JSON.stringify(data));

                    let mealTime;

                    // Handle different mealTime formats
                    if (data.mealTime && typeof data.mealTime === 'object') {
                        if (data.mealTime.seconds) {
                            // Firestore Timestamp
                            mealTime = new Date(data.mealTime.seconds * 1000);
                        } else if (data.mealTime.toDate) {
                            // Firestore Timestamp with toDate method
                            mealTime = data.mealTime.toDate();
                        } else if (data.mealTime._seconds) {
                            // Serialized Firestore Timestamp
                            mealTime = new Date(data.mealTime._seconds * 1000);
                        }
                    } else if (typeof data.mealTime === 'string') {
                        // ISO string format
                        mealTime = new Date(data.mealTime);
                    }

                    if (!mealTime) {
                        console.log('Could not parse mealTime for document:', doc.id);
                        return; // Skip this document
                    }

                    console.log('Parsed mealTime:', mealTime.toISOString());
                    console.log('Comparing with startDate:', startDate.toISOString(), 'and endDate:', endDate.toISOString());

                    // Only include foods within the date range
                    if (mealTime >= startDate && mealTime <= endDate) {
                        console.log('Document is within date range, including in results');
                        foods.push({
                            id: doc.id,
                            ...data,
                            // Replace the Firestore timestamp with a JavaScript Date for easier processing
                            mealTime: mealTime
                        });
                    } else {
                        console.log('Document is outside date range, skipping');
                    }
                });

                // Sort by mealTime
                foods.sort((a, b) => {
                    const timeA = new Date(a.mealTime.seconds * 1000);
                    const timeB = new Date(b.mealTime.seconds * 1000);
                    return timeA - timeB;
                });

                return foods;
            }
        } catch (error) {
            console.error('Error finding food history by date range:', error);
            throw error;
            throw error;
        }
    }

    /**
     * Update a food history record
     * @param {String} id - Food history ID
     * @param {Object} foodData - Food history data to update
     * @returns {Object} Updated food history object
     */
    static async update(id, foodData) {
        try {
            // Update food history in Firestore
            await foodHistoryCollection.doc(id).update(foodData);

            // Get the updated food history
            return await this.findById(id);
        } catch (error) {
            console.error('Error updating food history:', error);
            throw error;
        }
    }

    /**
     * Delete a food history record
     * @param {String} id - Food history ID
     * @returns {Boolean} Success status
     */
    static async delete(id) {
        try {
            await foodHistoryCollection.doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting food history:', error);
            throw error;
        }
    }
}

module.exports = FoodHistory;
