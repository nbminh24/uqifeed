const { db } = require('../config/firebase');

// Collection reference
const profilesCollection = db.collection('profiles');

/**
 * Profile Model
 * Handles all database operations related to user profiles
 */
class Profile {
    /**
     * Create a new profile
     * @param {Object} profileData - Profile data to create
     * @returns {Object} Created profile object
     */
    static async create(profileData) {
        try {
            // Add timestamp
            profileData.createdAt = new Date().toISOString();
            profileData.updatedAt = new Date().toISOString();

            // Check if user already has a profile
            const existingProfile = await this.findByUserId(profileData.userId);
            if (existingProfile) {
                throw new Error('User already has a profile');
            }

            // Create profile in Firestore
            const profileRef = await profilesCollection.add(profileData);

            // Get the profile data with ID
            const profile = await profileRef.get();
            return { id: profile.id, ...profile.data() };
        } catch (error) {
            console.error('Error creating profile:', error);
            throw error;
        }
    }

    /**
     * Find a profile by ID
     * @param {String} id - Profile ID
     * @returns {Object|null} Profile object or null if not found
     */
    static async findById(id) {
        try {
            const profileDoc = await profilesCollection.doc(id).get();

            if (!profileDoc.exists) {
                return null;
            }

            return { id: profileDoc.id, ...profileDoc.data() };
        } catch (error) {
            console.error('Error finding profile by ID:', error);
            throw error;
        }
    }

    /**
     * Find a profile by User ID
     * @param {String} userId - User ID
     * @returns {Object|null} Profile object or null if not found
     */
    static async findByUserId(userId) {
        try {
            const snapshot = await profilesCollection.where('userId', '==', userId).limit(1).get();

            if (snapshot.empty) {
                return null;
            }

            let profile = null;
            snapshot.forEach(doc => {
                profile = { id: doc.id, ...doc.data() };
            });

            return profile;
        } catch (error) {
            console.error('Error finding profile by user ID:', error);
            throw error;
        }
    }

    /**
     * Update a profile
     * @param {String} id - Profile ID
     * @param {Object} profileData - Profile data to update
     * @returns {Object} Updated profile object
     */
    static async update(id, profileData) {
        try {
            // Add timestamp
            profileData.updatedAt = new Date().toISOString();

            // Update profile in Firestore
            await profilesCollection.doc(id).update(profileData);

            // Get the updated profile
            return await this.findById(id);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    /**
     * Delete a profile
     * @param {String} id - Profile ID
     * @returns {Boolean} Success status
     */
    static async delete(id) {
        try {
            await profilesCollection.doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting profile:', error);
            throw error;
        }
    }

    /**
     * Find all profiles with pagination
     * @param {Number} limit - Number of profiles to retrieve
     * @param {Number} page - Page number
     * @returns {Array} Array of profile objects
     */
    static async findAll(limit = 10, page = 1) {
        try {
            const offset = (page - 1) * limit;
            const snapshot = await profilesCollection.orderBy('createdAt', 'desc').limit(limit).offset(offset).get();

            const profiles = [];
            snapshot.forEach(doc => {
                profiles.push({ id: doc.id, ...doc.data() });
            });

            return profiles;
        } catch (error) {
            console.error('Error finding all profiles:', error);
            throw error;
        }
    }
}

module.exports = Profile;
