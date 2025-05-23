const { db } = require('../config/firebase');

// Collection reference
const mealTypesCollection = db.collection('meal_types');

/**
 * MealType Model
 * Handles all database operations related to meal types
 */
class MealType {
    /**
     * Create a new meal type
     * @param {Object} mealTypeData - Meal type data to create
     * @returns {Object} Created meal type object
     */
    static async create(mealTypeData) {
        try {
            // Add timestamp
            mealTypeData.createdAt = new Date().toISOString();
            mealTypeData.updatedAt = new Date().toISOString();

            // Check if meal type already exists
            const existingMealType = await this.findByName(mealTypeData.name);
            if (existingMealType) {
                throw new Error('Meal type already exists');
            }

            // Create meal type in Firestore
            const mealTypeRef = await mealTypesCollection.add(mealTypeData);

            // Get the meal type data with ID
            const mealType = await mealTypeRef.get();
            return { id: mealType.id, ...mealType.data() };
        } catch (error) {
            console.error('Error creating meal type:', error);
            throw error;
        }
    }

    /**
     * Find a meal type by ID
     * @param {String} id - Meal type ID
     * @returns {Object|null} Meal type object or null if not found
     */
    static async findById(id) {
        try {
            const mealTypeDoc = await mealTypesCollection.doc(id).get();

            if (!mealTypeDoc.exists) {
                return null;
            }

            return { id: mealTypeDoc.id, ...mealTypeDoc.data() };
        } catch (error) {
            console.error('Error finding meal type by ID:', error);
            throw error;
        }
    }

    /**
     * Find a meal type by name
     * @param {String} name - Meal type name
     * @returns {Object|null} Meal type object or null if not found
     */
    static async findByName(name) {
        try {
            const snapshot = await mealTypesCollection.where('name', '==', name).limit(1).get();

            if (snapshot.empty) {
                return null;
            }

            let mealType = null;
            snapshot.forEach(doc => {
                mealType = { id: doc.id, ...doc.data() };
            });

            return mealType;
        } catch (error) {
            console.error('Error finding meal type by name:', error);
            throw error;
        }
    }

    /**
     * Update a meal type
     * @param {String} id - Meal type ID
     * @param {Object} mealTypeData - Meal type data to update
     * @returns {Object} Updated meal type object
     */
    static async update(id, mealTypeData) {
        try {
            // Add timestamp
            mealTypeData.updatedAt = new Date().toISOString();

            // Update meal type in Firestore
            await mealTypesCollection.doc(id).update(mealTypeData);

            // Get the updated meal type
            return await this.findById(id);
        } catch (error) {
            console.error('Error updating meal type:', error);
            throw error;
        }
    }

    /**
     * Delete a meal type
     * @param {String} id - Meal type ID
     * @returns {Boolean} Success status
     */
    static async delete(id) {
        try {
            await mealTypesCollection.doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting meal type:', error);
            throw error;
        }
    }

    /**
     * Find all meal types
     * @returns {Array} Array of meal type objects
     */
    static async findAll() {
        try {
            const snapshot = await mealTypesCollection.orderBy('name').get();

            const mealTypes = [];
            snapshot.forEach(doc => {
                mealTypes.push({ id: doc.id, ...doc.data() });
            });

            return mealTypes;
        } catch (error) {
            console.error('Error finding all meal types:', error);
            throw error;
        }
    }
}

module.exports = MealType;
