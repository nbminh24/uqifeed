/**
 * Nutrition Comment Model
 * Model for storing nutrition comments in the database
 */
const { db } = require('../config/firebase');

// Collection reference
const commentsCollection = db.collection('nutrition_comments');

/**
 * Nutrition Comment Model
 * Handles all database operations related to nutrition comments
 */
class NutritionComment {
    constructor(data) {
        this.data = {
            food_id: data.food_id || '',
            target_nutrition_id: data.target_nutrition_id || '',
            nutrition_type: data.nutrition_type || '',
            nutrition_delta: data.nutrition_delta || 0,
            nutrition_comment: data.nutrition_comment || '',
            icon: data.icon || '',
            meal_type: data.meal_type || ''
        };
    }

    /**
     * Save nutrition comment to database
     * @returns {Object} Saved comment object with ID
     */
    async save() {
        try {
            // Add timestamps
            const now = new Date().toISOString();
            this.data.created_at = now;
            this.data.updated_at = now;

            // Create comment in Firestore
            const commentRef = await commentsCollection.add(this.data);

            // Get the comment data with ID
            const comment = await commentRef.get();
            return { id: comment.id, ...comment.data() };
        } catch (error) {
            console.error('Error saving nutrition comment:', error);
            throw error;
        }
    }

    /**
     * Find nutrition comments by food ID
     * @param {string} foodId - Food ID to search for
     * @returns {Array} Array of nutrition comment objects
     */
    static async findByFoodId(foodId) {
        try {
            const snapshot = await commentsCollection.where('food_id', '==', foodId).get();

            if (snapshot.empty) {
                return [];
            }

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error finding nutrition comments by food ID:', error);
            throw error;
        }
    }

    /**
     * Delete a nutrition comment by ID
     * @param {string} id - Comment ID to delete
     * @returns {boolean} Success status
     */    static async delete(id) {
        try {
            await commentsCollection.doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting nutrition comment:', error);
            throw error;
        }
    }
}

module.exports = NutritionComment;

module.exports = NutritionComment;
