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
            }            // Create target nutrition in Firestore
            console.log('[TargetNutrition Model] Creating new document with data:', JSON.stringify(nutritionData, null, 2));

            // Ensure we only save the needed fields
            const dataToSave = {
                userId: nutritionData.userId,
                profileId: nutritionData.profileId,
                daily: nutritionData.daily,
                meals: nutritionData.meals,
                calculations: nutritionData.calculations,
                createdAt: nutritionData.createdAt,
                updatedAt: nutritionData.updatedAt
            };

            const nutritionRef = await targetNutritionsCollection.add(dataToSave);
            console.log('[TargetNutrition Model] Created document with ID:', nutritionRef.id);

            // Get the target nutrition data with ID
            const nutrition = await nutritionRef.get();
            const result = { id: nutrition.id, ...nutrition.data() };
            console.log('[TargetNutrition Model] Retrieved created document:', result);
            return result;
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
            console.log('[TargetNutrition Model] Searching for target nutrition with userId:', userId);

            // First try with userId field
            let snapshot = await targetNutritionsCollection
                .where('userId', '==', userId)
                .limit(1)
                .get();

            // If not found, try with user_id field
            if (snapshot.empty) {
                console.log('[TargetNutrition Model] No document found with userId, trying user_id field');
                snapshot = await targetNutritionsCollection
                    .where('user_id', '==', userId)
                    .limit(1)
                    .get();
            }

            // If still not found, return null
            if (snapshot.empty) {
                console.log('[TargetNutrition Model] No document found for user:', userId);
                return null;
            }

            // Get the first document
            const doc = snapshot.docs[0];
            const nutrition = { id: doc.id, ...doc.data() };
            console.log('[TargetNutrition Model] Found document:', nutrition.id);
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
            nutritionData.updatedAt = new Date().toISOString();            // Update target nutrition in Firestore
            console.log('[TargetNutrition Model] Updating document:', id, 'with data:', JSON.stringify(nutritionData, null, 2));
            try {
                await targetNutritionsCollection.doc(id).update({
                    userId: nutritionData.userId,
                    profileId: nutritionData.profileId,
                    daily: nutritionData.daily,
                    meals: nutritionData.meals,
                    calculations: nutritionData.calculations,
                    updatedAt: nutritionData.updatedAt
                });
                console.log('[TargetNutrition Model] Update successful');
            } catch (updateError) {
                console.error('[TargetNutrition Model] Firestore update error:', updateError);
                throw updateError;
            }

            // Get the updated target nutrition
            const updated = await this.findById(id);
            console.log('[TargetNutrition Model] Retrieved updated document:', updated);
            return updated;
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
