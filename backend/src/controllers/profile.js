const Profile = require('../models/profile');
const TargetNutrition = require('../models/targetNutrition');
const NutritionCalculator = require('../services/nutritionCalculator');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');

/**
 * Profile Controller
 * Handles all profile-related operations
 */
const ProfileController = {
    /**
     * Create a new profile
     * @route POST /api/profiles
     * @access Private
     */
    createProfile: async (req, res) => {
        try {
            console.log('[Profile Controller] Create request body:', req.body);
            const {
                gender,
                birthday,
                height,
                currentWeight,
                targetWeight,
                target_time,  // Changed from targetTime to target_time
                activityLevel,
                goal,
                dietType
            } = req.body;

            // Check if user already has a profile
            const existingProfile = await Profile.findByUserId(req.user.id);
            if (existingProfile) {
                return sendErrorResponse(
                    res,
                    'User already has a profile',
                    400
                );
            }

            // Create profile
            const profileData = {
                userId: req.user.id,
                gender,
                birthday,
                height: parseFloat(height),
                currentWeight: parseFloat(currentWeight),
                targetWeight: parseFloat(targetWeight),
                target_time,  // Changed from targetTime to target_time
                activityLevel,
                goal,
                dietType
            };

            console.log('[Profile Controller] Creating profile with data:', profileData);
            const profile = await Profile.create(profileData);

            return sendSuccessResponse(
                res,
                'Profile created successfully',
                { profile },
                201
            );
        } catch (error) {
            console.error('[Profile Controller] Create error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error creating profile',
                500
            );
        }
    },

    /**
     * Get user profile
     * @route GET /api/profiles/me
     * @access Private
     */
    getProfile: async (req, res) => {
        try {
            const profile = await Profile.findByUserId(req.user.id);

            if (!profile) {
                return sendErrorResponse(
                    res,
                    'Profile not found',
                    404
                );
            }

            return sendSuccessResponse(
                res,
                'Profile retrieved successfully',
                { profile }
            );
        } catch (error) {
            console.error('Get profile error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving profile',
                500
            );
        }
    },

    /**
     * Update user profile
     * @route PUT /api/profiles/me
     * @access Private
     */
    updateProfile: async (req, res) => {
        try {
            console.log('[Profile Controller] Update request body:', req.body);

            // Check if profile exists
            const profile = await Profile.findByUserId(req.user.id);
            if (!profile) {
                return sendErrorResponse(res, 'Profile not found', 404);
            }

            // Validation is handled by express-validator middleware
            const {
                gender,
                birthday,
                height,
                currentWeight,
                targetWeight,
                target_time,
                activityLevel,
                goal,
                dietType
            } = req.body;

            const profileData = {
                gender: gender ?? profile.gender,
                birthday: birthday ?? profile.birthday,
                height: height !== undefined ? parseFloat(height) : profile.height,
                currentWeight: currentWeight !== undefined ? parseFloat(currentWeight) : profile.currentWeight,
                targetWeight: targetWeight !== undefined ? parseFloat(targetWeight) : profile.targetWeight,
                target_time: target_time ?? profile.target_time,
                activityLevel: activityLevel ?? profile.activityLevel,
                goal: goal ?? profile.goal,
                dietType: dietType ?? profile.dietType
            }; console.log('[Profile Controller] Update data:', profileData);
            const updatedProfile = await Profile.update(profile.id, profileData);
            console.log('[Profile Controller] Updated profile:', updatedProfile);            // Calculate and update nutrition targets based on updated profile
            console.log('[Profile Controller] Calculating nutrition targets for updated profile:', updatedProfile);
            const nutritionTargets = NutritionCalculator.calculateNutritionTargets(updatedProfile);
            console.log('[Profile Controller] Calculated nutrition targets:', nutritionTargets);

            try {
                const existingNutrition = await TargetNutrition.findByUserId(req.user.id);
                const nutritionData = {
                    userId: req.user.id,
                    profileId: updatedProfile.id,
                    daily: nutritionTargets.daily,
                    meals: nutritionTargets.meals,
                    calculations: nutritionTargets.calculations
                };
                console.log('[Profile Controller] Nutrition data to save:', nutritionData);

                let savedNutrition;
                if (existingNutrition) {
                    console.log('[Profile Controller] Updating existing target nutrition:', existingNutrition.id);
                    savedNutrition = await TargetNutrition.update(existingNutrition.id, nutritionData);
                } else {
                    console.log('[Profile Controller] Creating new target nutrition');
                    savedNutrition = await TargetNutrition.create(nutritionData);
                }
                console.log('[Profile Controller] Successfully saved target nutrition:', savedNutrition);
            } catch (error) {
                console.error('[Profile Controller] Error saving target nutrition:', error);
                // Still send success response since profile was updated
                return sendSuccessResponse(res, 'Profile updated successfully but failed to update nutrition targets. Please recalculate your nutrition targets.', { profile: updatedProfile });
            }

            console.log('[Profile Controller] Sending successful response');
            return sendSuccessResponse(res, 'Profile updated successfully', {
                profile: updatedProfile,
                nutritionTargetsUpdated: true
            });
        } catch (error) {
            console.error('[Profile Controller] Update error:', error);
            return sendErrorResponse(res, error.message || 'Error updating profile', 500);
        }
    },

    /**
     * Get profile by ID (admin only)
     * @route GET /api/profiles/:id
     * @access Admin
     */
    getProfileById: async (req, res) => {
        try {
            // Check if user is admin
            if (req.user.role !== 'admin') {
                return sendErrorResponse(
                    res,
                    'Not authorized to access this resource',
                    403
                );
            }

            const profile = await Profile.findById(req.params.id);

            if (!profile) {
                return sendErrorResponse(
                    res,
                    'Profile not found',
                    404
                );
            }

            return sendSuccessResponse(
                res,
                'Profile retrieved successfully',
                { profile }
            );
        } catch (error) {
            console.error('Get profile by ID error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving profile',
                500
            );
        }
    },

    /**
     * Get all profiles (admin only)
     * @route GET /api/profiles
     * @access Admin
     */
    getAllProfiles: async (req, res) => {
        try {
            // Check if user is admin
            if (req.user.role !== 'admin') {
                return sendErrorResponse(
                    res,
                    'Not authorized to access this resource',
                    403
                );
            }

            const { page = 1, limit = 10 } = req.query;
            const profiles = await Profile.findAll(parseInt(limit), parseInt(page));

            return sendSuccessResponse(
                res,
                'Profiles retrieved successfully',
                { profiles }
            );
        } catch (error) {
            console.error('Get all profiles error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving profiles',
                500
            );
        }
    }
};

module.exports = ProfileController;
