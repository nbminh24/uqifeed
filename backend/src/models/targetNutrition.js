const { db } = require('../config/firebase');

// Collection reference
const targetNutritionsCollection = db.collection('target_nutrients');

/**
 * Target Nutrition Model
 * Handles all database operations related to user nutrition targets
 */
class TargetNutrition {
    /**
     * Create a new target nutrition
     * @param {Object} nutritionData - Target nutrition data to create
     * @returns {Object} Created target nutrition object
     */
    static async create(nutritionData) {
        try {
            // Add timestamp
            nutritionData.createdAt = new Date().toISOString();
            nutritionData.updatedAt = new Date().toISOString();

            // Check if user already has a target nutrition
            const existingNutrition = await this.findByUserId(nutritionData.userId);
            if (existingNutrition) {
                // Update the existing nutrition instead of creating a new one
                return await this.update(existingNutrition.id, nutritionData);
            }

            // Create target nutrition in Firestore
            const nutritionRef = await targetNutritionsCollection.add(nutritionData);

            // Get the target nutrition data with ID
            const nutrition = await nutritionRef.get();
            return { id: nutrition.id, ...nutrition.data() };
        } catch (error) {
            console.error('Error creating target nutrition:', error);
            throw error;
        }
    }

    /**
     * Find a target nutrition by ID
     * @param {String} id - Target nutrition ID
     * @returns {Object|null} Target nutrition object or null if not found
     */
    static async findById(id) {
        try {
            const nutritionDoc = await targetNutritionsCollection.doc(id).get();

            if (!nutritionDoc.exists) {
                return null;
            }

            return { id: nutritionDoc.id, ...nutritionDoc.data() };
        } catch (error) {
            console.error('Error finding target nutrition by ID:', error);
            throw error;
        }
    }

    /**
     * Find a target nutrition by User ID
     * @param {String} userId - User ID
     * @returns {Object|null} Target nutrition object or null if not found
     */    static async findByUserId(userId) {
        try {
            console.log('Searching for target nutrition with userId:', userId);
            const snapshot = await targetNutritionsCollection
                .where('userId', '==', userId)
                .limit(1)
                .get();

            if (snapshot.empty) {
                console.log('No target nutrition found in collection');
                // Try alternate field name
                const snapshot2 = await targetNutritionsCollection
                    .where('user_id', '==', userId)
                    .limit(1)
                    .get();

                if (snapshot2.empty) {
                    console.log('No target nutrition found with alternate field name');
                    return null;
                }

                let nutrition = null;
                snapshot2.forEach(doc => {
                    nutrition = { id: doc.id, ...doc.data() };
                });
                console.log('Found target nutrition with alternate field name:', nutrition?.id);
                return nutrition;
            }

            let nutrition = null;
            snapshot.forEach(doc => {
                nutrition = { id: doc.id, ...doc.data() };
            });
            console.log('Found target nutrition:', nutrition?.id);

            return nutrition;
        } catch (error) {
            console.error('Error finding target nutrition by user ID:', error);
            throw error;
        }
    }

    /**
     * Update a target nutrition
     * @param {String} id - Target nutrition ID
     * @param {Object} nutritionData - Target nutrition data to update
     * @returns {Object} Updated target nutrition object
     */
    static async update(id, nutritionData) {
        try {
            // Add timestamp
            nutritionData.updatedAt = new Date().toISOString();

            // Update target nutrition in Firestore
            await targetNutritionsCollection.doc(id).update(nutritionData);

            // Get the updated target nutrition
            return await this.findById(id);
        } catch (error) {
            console.error('Error updating target nutrition:', error);
            throw error;
        }
    }

    /**
     * Delete a target nutrition
     * @param {String} id - Target nutrition ID
     * @returns {Boolean} Success status
     */
    static async delete(id) {
        try {
            await targetNutritionsCollection.doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting target nutrition:', error);
            throw error;
        }
    }
}

module.exports = TargetNutrition;
