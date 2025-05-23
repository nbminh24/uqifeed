const { db } = require('../config/firebase');

// Collection reference
const imagesCollection = db.collection('images');

/**
 * Image Model
 * Handles all database operations related to images
 */
class Image {
    /**
     * Save image data to database
     * @param {Object} imageData - Image data to save
     * @returns {Object} Saved image object
     */
    static async save(imageData) {
        try {
            // Add timestamp
            imageData.createdAt = new Date().toISOString();

            // Create image in Firestore
            const imageRef = await imagesCollection.add(imageData);

            // Get the image data with ID
            const image = await imageRef.get();
            return { id: image.id, ...image.data() };
        } catch (error) {
            console.error('Error saving image:', error);
            throw error;
        }
    }

    /**
     * Find an image by ID
     * @param {String} id - Image ID
     * @returns {Object|null} Image object or null if not found
     */
    static async findById(id) {
        try {
            const imageDoc = await imagesCollection.doc(id).get();

            if (!imageDoc.exists) {
                return null;
            }

            return { id: imageDoc.id, ...imageDoc.data() };
        } catch (error) {
            console.error('Error finding image by ID:', error);
            throw error;
        }
    }

    /**
     * Find images by user ID
     * @param {String} userId - User ID
     * @returns {Array} Array of image objects
     */
    static async findByUserId(userId) {
        try {
            const snapshot = await imagesCollection
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            const images = [];
            snapshot.forEach(doc => {
                images.push({ id: doc.id, ...doc.data() });
            });

            return images;
        } catch (error) {
            console.error('Error finding images by user ID:', error);
            throw error;
        }
    }
}

module.exports = Image;

module.exports = Image;
