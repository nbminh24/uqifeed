/**
 * Nutrition Comment Model
 * Model for storing nutrition comments in the database
 */
const admin = require('firebase-admin');
const db = admin.firestore();
const commentsCollection = db.collection('nutrition_comments');

class NutritionComment {
    /**
     * Save a nutrition comment to the database
     * @param {Object} commentData - Comment data to save
     * @returns {Object} Saved comment with ID
     */
    static async save(commentData) {
        try {
            // Add timestamps
            const now = new Date().toISOString();
            commentData.created_at = now;
            commentData.updated_at = now;

            // Save to database
            const docRef = await commentsCollection.add(commentData);

            // Return saved data with ID
            return {
                id: docRef.id,
                ...commentData
            };
        } catch (error) {
            console.error('Error saving nutrition comment:', error);
            throw error;
        }
    }

    /**
     * Find a nutrition comment by ID
     * @param {String} id - Comment ID
     * @returns {Object} Comment data
     */
    static async findById(id) {
        try {
            const doc = await commentsCollection.doc(id).get();
            if (!doc.exists) {
                return null;
            }
            return {
                id: doc.id,
                ...doc.data()
            };
        } catch (error) {
            console.error('Error finding nutrition comment by ID:', error);
            throw error;
        }
    }

    /**
     * Find nutrition comments by food ID
     * @param {String} foodId - Food ID
     * @returns {Array} Array of comment data
     */
    static async findByFoodId(foodId) {
        try {
            const snapshot = await commentsCollection
                .where('food_id', '==', foodId)
                .get();

            if (snapshot.empty) {
                return [];
            }

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error finding nutrition comments by food ID:', error);
            throw error;
        }
    }

    /**
     * Find nutrition comments by food ID and nutrition type
     * @param {String} foodId - Food ID
     * @param {String} nutritionType - Nutrition type (Protein, Fat, Carb, Fiber, Calorie)
     * @returns {Object} Comment data or null if not found
     */
    static async findByFoodAndType(foodId, nutritionType) {
        try {
            const snapshot = await commentsCollection
                .where('food_id', '==', foodId)
                .where('nutrition_type', '==', nutritionType)
                .limit(1)
                .get();

            if (snapshot.empty) {
                return null;
            }

            const doc = snapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data()
            };
        } catch (error) {
            console.error('Error finding nutrition comment by food and type:', error);
            throw error;
        }
    }

    /**
     * Update a nutrition comment
     * @param {String} id - Comment ID
     * @param {Object} commentData - Updated comment data
     * @returns {Object} Updated comment data
     */
    static async update(id, commentData) {
        try {
            // Add update timestamp
            commentData.updated_at = new Date().toISOString();

            // Update in database
            await commentsCollection.doc(id).update(commentData);

            // Return updated data with ID
            return {
                id,
                ...commentData
            };
        } catch (error) {
            console.error('Error updating nutrition comment:', error);
            throw error;
        }
    }

    /**
     * Delete a nutrition comment
     * @param {String} id - Comment ID
     * @returns {Boolean} True if deleted successfully
     */
    static async delete(id) {
        try {
            await commentsCollection.doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting nutrition comment:', error);
            throw error;
        }
    }

    /**
     * Delete all nutrition comments for a food
     * @param {String} foodId - Food ID
     * @returns {Boolean} True if deleted successfully
     */
    static async deleteByFoodId(foodId) {
        try {
            const batch = db.batch();
            const snapshot = await commentsCollection
                .where('food_id', '==', foodId)
                .get();

            if (snapshot.empty) {
                return true;
            }

            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            return true;
        } catch (error) {
            console.error('Error deleting nutrition comments by food ID:', error);
            throw error;
        }
    }
}

module.exports = NutritionComment;
