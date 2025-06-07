const { db } = require('../config/firebase');

// Collection reference
const nutritionScoresCollection = db.collection('nutrition_scores');

/**
 * Nutrition Score Model
 * Handles all database operations related to nutrition scores
 */
class NutritionScore {
    /**
     * Save nutrition score data to database
     * @param {Object} scoreData - Nutrition score data to save
     * @returns {Object} Saved nutrition score object
     */
    static async save(scoreData) {
        try {
            // Add timestamps
            const now = new Date().toISOString();
            scoreData.created_at = now;
            scoreData.updated_at = now;

            // Create nutrition score in Firestore
            const scoreRef = await nutritionScoresCollection.add(scoreData);

            // Get the nutrition score data with ID
            const score = await scoreRef.get();
            return { id: score.id, ...score.data() };
        } catch (error) {
            console.error('Error saving nutrition score:', error);
            throw error;
        }
    }

    /**
     * Find a nutrition score by ID
     * @param {String} id - Nutrition score ID
     * @returns {Object|null} Nutrition score object or null if not found
     */
    static async findById(id) {
        try {
            const scoreDoc = await nutritionScoresCollection.doc(id).get();

            if (!scoreDoc.exists) {
                return null;
            }

            return { id: scoreDoc.id, ...scoreDoc.data() };
        } catch (error) {
            console.error('Error finding nutrition score by ID:', error);
            throw error;
        }
    }

    /**
     * Find a nutrition score by food ID
     * @param {String} foodId - Food ID
     * @returns {Object|null} Nutrition score object or null if not found
     */
    static async findByFoodId(foodId) {
        try {
            const snapshot = await nutritionScoresCollection
                .where('food_id', '==', foodId)
                .limit(1)
                .get();

            if (snapshot.empty) {
                return null;
            }

            let score = null;
            snapshot.forEach(doc => {
                score = { id: doc.id, ...doc.data() };
            });

            return score;
        } catch (error) {
            console.error('Error finding nutrition score by food ID:', error);
            throw error;
        }
    }

    /**
     * Find nutrition scores by target nutrition ID
     * @param {String} targetNutritionId - Target nutrition ID
     * @returns {Array} Array of nutrition score objects
     */
    static async findByTargetNutritionId(targetNutritionId) {
        try {
            const snapshot = await nutritionScoresCollection
                .where('target_nutrition_id', '==', targetNutritionId)
                .get();

            const scores = [];
            snapshot.forEach(doc => {
                scores.push({ id: doc.id, ...doc.data() });
            });

            return scores;
        } catch (error) {
            console.error('Error finding nutrition scores by target nutrition ID:', error);
            throw error;
        }
    }

    /**
     * Update a nutrition score
     * @param {String} id - Nutrition score ID
     * @param {Object} scoreData - Nutrition score data to update
     * @returns {Object} Updated nutrition score object
     */
    static async update(id, scoreData) {
        try {
            // Add timestamp
            scoreData.updated_at = new Date().toISOString();

            // Update nutrition score in Firestore
            await nutritionScoresCollection.doc(id).update(scoreData);

            // Get the updated nutrition score
            return await this.findById(id);
        } catch (error) {
            console.error('Error updating nutrition score:', error);
            throw error;
        }
    }

    /**
     * Delete a nutrition score
     * @param {String} id - Nutrition score ID
     * @returns {Boolean} Success status
     */
    static async delete(id) {
        try {
            await nutritionScoresCollection.doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting nutrition score:', error);
            throw error;
        }
    }

    /**
     * Delete nutrition scores by food ID
     * @param {String} foodId - Food ID
     * @returns {Promise<void>}
     */
    static async deleteByFoodId(foodId) {
        try {
            const snapshot = await nutritionScoresCollection
                .where('food_id', '==', foodId)
                .get();

            const batch = db.batch();
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();
        } catch (error) {
            console.error('Error deleting nutrition scores by food ID:', error);
            throw error;
        }
    }
}

module.exports = NutritionScore;
