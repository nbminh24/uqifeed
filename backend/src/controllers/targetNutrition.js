const Profile = require('../models/profile');
const TargetNutrition = require('../models/targetNutrition');
const NutritionCalculator = require('../services/nutritionCalculator');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');

/**
 * Target Nutrition Controller
 * Handles all target nutrition-related operations
 */
const TargetNutritionController = {
    /**
     * Calculate and store nutrition targets for a user
     * @route POST /api/nutrition/calculate
     * @access Private
     */
    calculateNutrition: async (req, res) => {
        try {
            // Get user profile
            const profile = await Profile.findByUserId(req.user.id);

            if (!profile) {
                return sendErrorResponse(
                    res,
                    'Profile not found. Please create your profile first.',
                    404
                );
            }

            // Calculate nutrition targets based on profile
            const nutritionTargets = NutritionCalculator.calculateNutritionTargets(profile);

            // Store nutrition targets in database
            const nutritionData = {
                userId: req.user.id,
                profileId: profile.id,
                daily: nutritionTargets.daily,
                meals: nutritionTargets.meals,
                calculations: nutritionTargets.calculations
            };

            const nutrition = await TargetNutrition.create(nutritionData);

            return sendSuccessResponse(
                res,
                'Nutrition targets calculated successfully',
                { nutrition }
            );
        } catch (error) {
            console.error('Calculate nutrition error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error calculating nutrition targets',
                500
            );
        }
    },

    /**
     * Get user's target nutrition
     * @route GET /api/nutrition/me
     * @access Private
     */
    getNutrition: async (req, res) => {
        try {
            const nutrition = await TargetNutrition.findByUserId(req.user.id);

            if (!nutrition) {
                return sendErrorResponse(
                    res,
                    'Nutrition targets not found. Please calculate your nutrition targets first.',
                    404
                );
            }

            return sendSuccessResponse(
                res,
                'Nutrition targets retrieved successfully',
                { nutrition }
            );
        } catch (error) {
            console.error('Get nutrition error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving nutrition targets',
                500
            );
        }
    },

    /**
     * Recalculate nutrition targets after profile update
     * @route PUT /api/nutrition/recalculate
     * @access Private
     */
    recalculateNutrition: async (req, res) => {
        try {
            // Get user profile
            const profile = await Profile.findByUserId(req.user.id);

            if (!profile) {
                return sendErrorResponse(
                    res,
                    'Profile not found. Please create your profile first.',
                    404
                );
            }

            // Calculate new nutrition targets based on updated profile
            const nutritionTargets = NutritionCalculator.calculateNutritionTargets(profile);

            // Find existing nutrition targets
            const existingNutrition = await TargetNutrition.findByUserId(req.user.id);

            // Update or create nutrition targets
            let nutrition;
            if (existingNutrition) {
                // Update existing nutrition targets
                nutrition = await TargetNutrition.update(existingNutrition.id, {
                    profileId: profile.id,
                    daily: nutritionTargets.daily,
                    meals: nutritionTargets.meals,
                    calculations: nutritionTargets.calculations
                });
            } else {
                // Create new nutrition targets
                nutrition = await TargetNutrition.create({
                    userId: req.user.id,
                    profileId: profile.id,
                    daily: nutritionTargets.daily,
                    meals: nutritionTargets.meals,
                    calculations: nutritionTargets.calculations
                });
            }

            return sendSuccessResponse(
                res,
                'Nutrition targets recalculated successfully',
                { nutrition }
            );
        } catch (error) {
            console.error('Recalculate nutrition error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error recalculating nutrition targets',
                500
            );
        }
    },

    /**
     * Get nutrition targets by ID (admin only)
     * @route GET /api/nutrition/:id
     * @access Admin
     */
    getNutritionById: async (req, res) => {
        try {
            // Check if user is admin
            if (req.user.role !== 'admin') {
                return sendErrorResponse(
                    res,
                    'Not authorized to access this resource',
                    403
                );
            }

            const nutrition = await TargetNutrition.findById(req.params.id);

            if (!nutrition) {
                return sendErrorResponse(
                    res,
                    'Nutrition targets not found',
                    404
                );
            }

            return sendSuccessResponse(
                res,
                'Nutrition targets retrieved successfully',
                { nutrition }
            );
        } catch (error) {
            console.error('Get nutrition by ID error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving nutrition targets',
                500
            );
        }
    }
};

module.exports = TargetNutritionController;
