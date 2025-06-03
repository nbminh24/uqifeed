const { db } = require('../config/firebase');

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
        try {            // Add timestamps and ensure required fields
            const now = new Date().toISOString();
            const sanitizedData = {
                ...foodData,
                created_at: now,
                updated_at: now,
                food_image: foodData.food_image || null,
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
     * Update a food
     * @param {String} id - Food ID
     * @param {Object} updateData - Data to update
     * @returns {Object} Updated food object
     */
    static async update(id, updateData) {
        try {
            // Add update timestamp
            updateData.updated_at = new Date().toISOString();

            // Update food in Firestore
            await foodsCollection.doc(id).update(updateData);

            // Get updated food
            return await this.findById(id);
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
}

module.exports = Food;
