const { db } = require('../config/firebase');

// Collection reference
const ingredientsCollection = db.collection('ingredients');

/**
 * Ingredient Model
 * Handles all database operations related to ingredients
 */
class Ingredient {
    /**
     * Save ingredient data to database
     * @param {Object} ingredientData - Ingredient data to save
     * @returns {Object} Saved ingredient object
     */
    static async save(ingredientData) {
        try {
            // Add timestamps
            const now = new Date().toISOString();
            ingredientData.created_at = now;
            ingredientData.updated_at = now;

            // Create ingredient in Firestore
            const ingredientRef = await ingredientsCollection.add(ingredientData);

            // Get the ingredient data with ID
            const ingredient = await ingredientRef.get();
            return { id: ingredient.id, ...ingredient.data() };
        } catch (error) {
            console.error('Error saving ingredient:', error);
            throw error;
        }
    }

    /**
     * Find an ingredient by ID
     * @param {String} id - Ingredient ID
     * @returns {Object|null} Ingredient object or null if not found
     */
    static async findById(id) {
        try {
            const ingredientDoc = await ingredientsCollection.doc(id).get();

            if (!ingredientDoc.exists) {
                return null;
            }

            return { id: ingredientDoc.id, ...ingredientDoc.data() };
        } catch (error) {
            console.error('Error finding ingredient by ID:', error);
            throw error;
        }
    }

    /**
     * Find ingredients by food ID
     * @param {String} foodId - Food ID
     * @returns {Array} Array of ingredient objects
     */
    static async findByFoodId(foodId) {
        try {
            const snapshot = await ingredientsCollection
                .where('food_id', '==', foodId)
                .get();

            const ingredients = [];
            snapshot.forEach(doc => {
                ingredients.push({ id: doc.id, ...doc.data() });
            });

            return ingredients;
        } catch (error) {
            console.error('Error finding ingredients by food ID:', error);
            throw error;
        }
    }

    /**
     * Save multiple ingredients in batch
     * @param {Array} ingredients - Array of ingredient data objects
     * @returns {Array} Array of saved ingredient objects
     */
    static async saveMany(ingredients) {
        try {
            const batch = db.batch();
            const now = new Date().toISOString();
            const savedIds = [];

            // Add each ingredient to batch
            for (const ingredient of ingredients) {
                // Add timestamps
                ingredient.created_at = now;
                ingredient.updated_at = now;

                const docRef = ingredientsCollection.doc();
                batch.set(docRef, ingredient);
                savedIds.push(docRef.id);
            }

            // Commit the batch
            await batch.commit();

            // Return saved ingredients
            const savedIngredients = [];
            for (let i = 0; i < savedIds.length; i++) {
                const id = savedIds[i];
                const data = ingredients[i];
                savedIngredients.push({ id, ...data });
            }

            return savedIngredients;
        } catch (error) {
            console.error('Error saving multiple ingredients:', error);
            throw error;
        }
    }

    /**
     * Delete ingredients by food ID
     * @param {String} foodId - Food ID
     * @returns {Number} Number of deleted ingredients
     */
    static async deleteByFoodId(foodId) {
        try {
            const snapshot = await ingredientsCollection
                .where('food_id', '==', foodId)
                .get();

            if (snapshot.empty) {
                return 0;
            }

            const batch = db.batch();
            let count = 0;

            snapshot.forEach(doc => {
                batch.delete(doc.ref);
                count++;
            });

            await batch.commit();
            return count;
        } catch (error) {
            console.error('Error deleting ingredients by food ID:', error);
            throw error;
        }
    }
}

module.exports = Ingredient;
