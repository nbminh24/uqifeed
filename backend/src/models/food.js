const { db } = require('../config/firebase');
const { DEFAULT_TEXT_ANALYSIS_IMAGE } = require('../config/defaultImages');

// Collection reference
const foodsCollection = db.collection('foods');

/**
 * Food Model
 * Handles all database operations related to food items
 */
class Food {
    /**
     * Save food data to database
     * @param {Object} foodData - Food data to save
     * @returns {Object} Saved food object
     */    static async save(foodData) {
        try {
            const now = new Date().toISOString();

            // Set default image for text analysis
            let food_image = foodData.food_image;
            if (!food_image && foodData.food_text_description) {
                food_image = DEFAULT_TEXT_ANALYSIS_IMAGE;
            }

            const sanitizedData = {
                ...foodData,
                created_at: now,
                updated_at: now,
                food_image,
                food_name: foodData.food_name || '',
                food_description: foodData.food_description || {},
                food_advice: foodData.food_advice || '',
                food_preparation: foodData.food_preparation || '',
                total_protein: foodData.total_protein || 0,
                total_carb: foodData.total_carb || 0,
                total_fat: foodData.total_fat || 0,
                total_fiber: foodData.total_fiber || 0,
                total_calorie: foodData.total_calorie || 0
            };

            console.log('Saving food with image:', food_image);

            // Create food in Firestore
            const foodRef = await foodsCollection.add(sanitizedData);

            // Get the food data with ID
            const food = await foodRef.get();
            return { id: food.id, ...food.data() };
        } catch (error) {
            console.error('Error saving food:', error);
            throw error;
        }
    }

    /**
     * Find a food by ID
     * @param {String} id - Food ID
     * @returns {Object|null} Food object or null if not found
     */
    static async findById(id) {
        try {
            const foodDoc = await foodsCollection.doc(id).get();

            if (!foodDoc.exists) {
                return null;
            }

            return { id: foodDoc.id, ...foodDoc.data() };
        } catch (error) {
            console.error('Error finding food by ID:', error);
            throw error;
        }
    }

    /**
     * Find foods by user ID
     * @param {String} userId - User ID
     * @param {Object} options - Query options (limit, sortBy, etc.)
     * @returns {Array} Array of food objects
     */    static async findByUserId(userId, options = {}) {
        try {
            // Simple query without sorting for now
            let query = foodsCollection.where('user_id', '==', userId);

            // Apply limit if specified
            if (options.limit) {
                query = query.limit(options.limit);
            }

            const snapshot = await query.get();

            const foods = [];
            snapshot.forEach(doc => {
                foods.push({ id: doc.id, ...doc.data() });
            });

            return foods;
        } catch (error) {
            console.error('Error finding foods by user ID:', error);
            throw error;
        }
    }

    /**
     * Find foods by meal type
     * @param {String} mealTypeId - Meal Type ID
     * @param {Object} options - Query options (limit, userId, sortBy, etc.)
     * @returns {Array} Array of food objects
     */
    static async findByMealType(mealTypeId, options = {}) {
        try {
            let query = foodsCollection.where('meal_type_id', '==', mealTypeId);

            // Filter by user if provided
            if (options.userId) {
                query = query.where('user_id', '==', options.userId);
            }

            // Apply sorting
            if (options.sortBy) {
                query = query.orderBy(options.sortBy, options.sortDir || 'desc');
            } else {
                query = query.orderBy('created_at', 'desc');
            }

            // Apply limit
            if (options.limit) {
                query = query.limit(options.limit);
            }

            const snapshot = await query.get();

            const foods = [];
            snapshot.forEach(doc => {
                foods.push({ id: doc.id, ...doc.data() });
            });

            return foods;
        } catch (error) {
            console.error('Error finding foods by meal type:', error);
            throw error;
        }
    }

    /**
     * Update food data
     * @param {String} id - Food ID
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated food object
     */
    static async update(id, updateData) {
        try {
            const foodDoc = await foodsCollection.doc(id).get();
            if (!foodDoc.exists) {
                throw new Error('Food not found');
            }
            const currentData = foodDoc.data();

            // Set default image for text analysis
            let food_image = updateData.food_image || currentData.food_image;
            if (!food_image && (updateData.food_text_description || currentData.food_text_description)) {
                food_image = DEFAULT_TEXT_ANALYSIS_IMAGE;
            }

            const now = new Date().toISOString();
            const sanitizedData = {
                ...updateData,
                updated_at: now,
                food_image
            };

            console.log('Updating food with image:', food_image);

            await foodsCollection.doc(id).update(sanitizedData);
            const updatedFoodDoc = await foodsCollection.doc(id).get();
            return { id: updatedFoodDoc.id, ...updatedFoodDoc.data() };
        } catch (error) {
            console.error('Error updating food:', error);
            throw error;
        }
    }

    /**
     * Delete a food
     * @param {String} id - Food ID
     * @returns {Boolean} True if delete successful
     */
    static async delete(id) {
        try {
            await foodsCollection.doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting food:', error);
            throw error;
        }
    }

    /**
     * Find foods by date range for a user
     * @param {String} userId - User ID
     * @param {String} startDate - Start date in ISO format
     * @param {String} endDate - End date in ISO format
     * @returns {Array} Array of food objects
     */    static async findByDateRange(userId, startDate, endDate) {
        try {
            console.log('Finding foods for user:', userId, 'between', startDate, 'and', endDate);

            // For Firestore date comparisons
            const startDateTime = new Date(startDate);
            startDateTime.setHours(0, 0, 0, 0);
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999);

            // Create compound query to filter by both user_id and date range
            let query = foodsCollection
                .where('user_id', '==', userId)
                .where('created_at', '>=', startDateTime.toISOString())
                .where('created_at', '<=', endDateTime.toISOString());            // Execute the query
            const snapshot = await query.get();

            // Convert snapshot to array of foods
            const foods = [];
            snapshot.forEach(doc => {
                foods.push({ id: doc.id, ...doc.data() });
            });

            console.log('Found', foods.length, 'foods for date range:', startDate, 'to', endDate);

            // Sort by created_at in descending order (newest first)
            return foods.sort((a, b) => {
                if (!a.created_at) return 1;
                if (!b.created_at) return -1;
                return b.created_at.localeCompare(a.created_at); // Descending order
            });
        } catch (error) {
            console.error('Error finding foods by date range:', error);
            throw error;
        }
    }
}

module.exports = Food;
