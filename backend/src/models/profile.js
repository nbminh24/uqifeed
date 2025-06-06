const { db } = require('../config/firebase');

// Collection reference
const profilesCollection = db.collection('profiles');

/**
 * Profile Model
 * Handles all database operations related to user profiles
 */
class Profile {    /**
     * Validate date string and return ISO format
     * @param {string} dateStr - Date string to validate
     * @returns {string|null} ISO formatted date string or null if invalid
     */
    static validateDate(dateStr) {
        try {
            console.log('[Profile Model] Validating date:', dateStr);
            if (!dateStr) {
                console.log('[Profile Model] No date provided');
                return null;
            }

            // If it's already a valid ISO string, return it as is
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(dateStr)) {
                console.log('[Profile Model] Date is already in ISO format');
                return dateStr;
            }

            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                console.error('[Profile Model] Invalid date:', dateStr);
                return null;
            }

            const isoString = date.toISOString();
            console.log('[Profile Model] Converted to ISO format:', isoString);
            return isoString;
        } catch (error) {
            console.error('[Profile Model] Error validating date:', dateStr, error);
            return null;
        }
    }

    /**
     * Format profile data to ensure dates are in ISO format
     * @param {Object} profile - Profile data to format
     * @returns {Object} Formatted profile data
     */
    static formatProfileData(profile) {
        if (!profile) return null;

        // Create a copy to avoid modifying the original
        const formatted = { ...profile };

        try {
            // Handle dates
            if (formatted.birthday) {
                formatted.birthday = this.validateDate(formatted.birthday);
            }

            if (formatted.target_time) {
                formatted.target_time = this.validateDate(formatted.target_time);
            }

            // Handle numeric fields
            if (formatted.height !== undefined) {
                formatted.height = parseFloat(formatted.height);
                if (isNaN(formatted.height)) throw new Error('Invalid height value');
            }

            if (formatted.currentWeight !== undefined) {
                formatted.currentWeight = parseFloat(formatted.currentWeight);
                if (isNaN(formatted.currentWeight)) throw new Error('Invalid current weight value');
            }

            if (formatted.targetWeight !== undefined) {
                formatted.targetWeight = parseFloat(formatted.targetWeight);
                if (isNaN(formatted.targetWeight)) throw new Error('Invalid target weight value');
            }

            return formatted;
        } catch (error) {
            console.error('Error formatting profile data:', error);
            throw error;
        }
    }

    /**
     * Validate profile data
     * @param {Object} profileData - Profile data to validate
     * @returns {string|null} Error message if validation fails, null if passes
     */
    static validateProfileData(profileData) {
        // Check required fields
        const requiredFields = [
            'gender',
            'birthday',
            'height',
            'currentWeight',
            'targetWeight',
            'target_time',
            'activityLevel',
            'goal',
            'dietType'
        ];

        for (const field of requiredFields) {
            if (profileData[field] === undefined || profileData[field] === null) {
                return `Missing required field: ${field}`;
            }
        }

        // Numeric validation
        const height = parseFloat(profileData.height);
        if (isNaN(height) || height < 100 || height > 250) {
            return 'Height must be between 100cm and 250cm';
        }

        const currentWeight = parseFloat(profileData.currentWeight);
        if (isNaN(currentWeight) || currentWeight < 30 || currentWeight > 300) {
            return 'Current weight must be between 30kg and 300kg';
        }

        const targetWeight = parseFloat(profileData.targetWeight);
        if (isNaN(targetWeight) || targetWeight < 30 || targetWeight > 300) {
            return 'Target weight must be between 30kg and 300kg';
        }

        // Date validation
        try {
            const birthday = new Date(profileData.birthday);
            const target_time = new Date(profileData.target_time);
            const now = new Date();

            if (birthday >= now) {
                return 'Birthday cannot be in the future';
            }

            if (target_time <= now) {
                return 'Target date must be in the future';
            }
        } catch (e) {
            return 'Invalid date format';
        }

        // Enum validation
        const validActivityLevels = ['Sedentary', 'Lightly active', 'Moderately active', 'Very active', 'Extra active'];
        if (!validActivityLevels.includes(profileData.activityLevel)) {
            return 'Invalid activity level';
        }

        const validGoals = ['Lose weight', 'Maintain weight', 'Gain weight'];
        if (!validGoals.includes(profileData.goal)) {
            return 'Invalid weight goal';
        }

        const validDietTypes = ['Balanced', 'Vegetarian', 'Vegan', 'Low-carb', 'Keto'];
        if (!validDietTypes.includes(profileData.dietType)) {
            return 'Invalid diet type';
        }

        return null;
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

            // Validate dates
            const validatedBirthday = this.validateDate(profileData.birthday);
            const validatedTargetTime = this.validateDate(profileData.target_time);

            if (!validatedBirthday || !validatedTargetTime) {
                throw new Error('Invalid date format');
            }

            // Update the dates with validated values
            profileData.birthday = validatedBirthday;
            profileData.target_time = validatedTargetTime;

            console.log('[Profile Model] Validated update data:', profileData);

            // Update profile in Firestore
            await profilesCollection.doc(id).update(profileData);

            // Get the updated profile
            const updatedDoc = await profilesCollection.doc(id).get();
            return { id: updatedDoc.id, ...updatedDoc.data() };
        } catch (error) {
            console.error('[Profile Model] Update error:', error);
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
