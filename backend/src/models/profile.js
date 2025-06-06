const { db } = require('../config/firebase');

// Collection reference
const profilesCollection = db.collection('profiles');

/**
 * Profile Model
 * Handles all database operations related to user profiles
 */
class Profile {
    /**
     * Format profile data to ensure dates are in ISO format
     * @param {Object} profile - Profile data to format
     * @returns {Object} Formatted profile data
     */
    static formatProfileData(profile) {
        if (!profile) return null;

        // Ensure dates are in ISO format
        const formatted = { ...profile };

        // Handle birthday
        if (formatted.birthday) {
            try {
                const birthdayDate = new Date(formatted.birthday);
                if (!isNaN(birthdayDate.getTime())) {
                    formatted.birthday = birthdayDate.toISOString();
                } else {
                    console.error('Invalid birthday date');
                    formatted.birthday = new Date().toISOString();
                }
            } catch (e) {
                console.error('Error formatting birthday:', e);
                formatted.birthday = new Date().toISOString();
            }
        }

        // Handle target_time
        if (formatted.target_time) {
            try {
                const targetDate = new Date(formatted.target_time);
                if (!isNaN(targetDate.getTime())) {
                    formatted.target_time = targetDate.toISOString();
                } else {
                    console.error('Invalid target_time date');
                    formatted.target_time = new Date().toISOString();
                }
            } catch (e) {
                console.error('Error formatting target_time:', e);
                formatted.target_time = new Date().toISOString();
            }
        }

        // Handle numeric values
        if (formatted.height !== undefined && formatted.height !== null) {
            formatted.height = parseFloat(formatted.height);
            if (isNaN(formatted.height)) formatted.height = null;
        }

        if (formatted.currentWeight !== undefined && formatted.currentWeight !== null) {
            formatted.currentWeight = parseFloat(formatted.currentWeight);
            if (isNaN(formatted.currentWeight)) formatted.currentWeight = null;
        }

        if (formatted.targetWeight !== undefined && formatted.targetWeight !== null) {
            formatted.targetWeight = parseFloat(formatted.targetWeight);
            if (isNaN(formatted.targetWeight)) formatted.targetWeight = null;
        }

        return formatted;
    }

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

            // Format data
            const formattedData = this.formatProfileData(profileData);

            // Check if user already has a profile
            const existingProfile = await this.findByUserId(formattedData.userId);
            if (existingProfile) {
                throw new Error('User already has a profile');
            }

            // Create profile in Firestore
            const profileRef = await profilesCollection.add(formattedData);

            // Get the created profile
            const profile = await profileRef.get();
            return this.formatProfileData({ id: profile.id, ...profile.data() });
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

            return this.formatProfileData({ id: profileDoc.id, ...profileDoc.data() });
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
                const data = doc.data();
                profile = this.formatProfileData({ id: doc.id, ...data });
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

            // Format data before update
            const formattedData = this.formatProfileData(profileData);
            console.log('Formatted data before update:', formattedData); // Debug log

            // Update profile in Firestore
            await profilesCollection.doc(id).update(formattedData);

            // Get the updated profile
            const updatedDoc = await profilesCollection.doc(id).get();
            const updatedProfile = this.formatProfileData({ id: updatedDoc.id, ...updatedDoc.data() });
            console.log('Updated profile:', updatedProfile); // Debug log

            return updatedProfile;
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
