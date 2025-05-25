/**
 * Nutrition Comment Controller
 * Controller for handling nutrition comment-related requests
 */
const NutritionComment = require('../models/nutritionComment');
const NutritionCommentService = require('../services/nutritionCommentService');
const Food = require('../models/food');
const TargetNutrition = require('../models/targetNutrition');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Generate and store nutrition comments for a food
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function generateComments(req, res) {
    try {
        const { foodId, targetNutritionId } = req.params;
        const { mealType } = req.query;

        // Get food and target nutrition
        const food = await Food.findById(foodId);
        if (!food) {
            return errorResponse(res, 404, 'Food not found');
        }

        const targetNutrition = await TargetNutrition.findById(targetNutritionId);
        if (!targetNutrition) {
            return errorResponse(res, 404, 'Target nutrition not found');
        }

        // Use food's meal_type_id if available and no mealType is provided in query
        const effectiveMealType = mealType || food.meal_type_id || 'default';

        // Generate comments
        const comments = NutritionCommentService.generateAllComments(food, targetNutrition, effectiveMealType);

        // Delete existing comments for this food
        await NutritionComment.deleteByFoodId(foodId);

        // Save comments to database
        const savedComments = {};

        for (const nutrientType in comments) {
            const comment = comments[nutrientType];
            const nutritionType = convertNutrientTypeForDatabase(nutrientType);

            const commentData = {
                food_id: foodId,
                target_nutrition_id: targetNutritionId,
                nutrition_type: nutritionType,
                nutrition_delta: comment.percentage,
                nutrition_comment: comment.comment,
                icon: comment.icon,
                meal_type: effectiveMealType
            };

            savedComments[nutrientType] = await NutritionComment.save(commentData);
        }

        return successResponse(res, 'Nutrition comments generated successfully', savedComments);
    } catch (error) {
        console.error('Error generating nutrition comments:', error);
        return errorResponse(res, 500, 'Failed to generate nutrition comments');
    }
}

/**
 * Get nutrition comments for a food
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function getCommentsByFood(req, res) {
    try {
        const { foodId } = req.params;

        // Check if food exists
        const food = await Food.findById(foodId);
        if (!food) {
            return errorResponse(res, 404, 'Food not found');
        }

        // Get comments
        const comments = await NutritionComment.findByFoodId(foodId);

        // Format comments for response
        const formattedComments = {};

        comments.forEach(comment => {
            const nutrientType = convertDatabaseTypeToNutrientType(comment.nutrition_type);
            formattedComments[nutrientType] = comment;
        });

        return successResponse(res, 'Nutrition comments retrieved successfully', formattedComments);
    } catch (error) {
        console.error('Error getting nutrition comments:', error);
        return errorResponse(res, 500, 'Failed to get nutrition comments');
    }
}

/**
 * Get nutrition comment by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function getCommentById(req, res) {
    try {
        const { commentId } = req.params;

        // Get comment
        const comment = await NutritionComment.findById(commentId);
        if (!comment) {
            return errorResponse(res, 404, 'Nutrition comment not found');
        }

        return successResponse(res, 'Nutrition comment retrieved successfully', comment);
    } catch (error) {
        console.error('Error getting nutrition comment:', error);
        return errorResponse(res, 500, 'Failed to get nutrition comment');
    }
}

/**
 * Update a nutrition comment
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function updateComment(req, res) {
    try {
        const { commentId } = req.params;
        const { nutrition_comment } = req.body;

        // Check if comment exists
        const existingComment = await NutritionComment.findById(commentId);
        if (!existingComment) {
            return errorResponse(res, 404, 'Nutrition comment not found');
        }

        // Update comment
        const updatedComment = await NutritionComment.update(commentId, {
            nutrition_comment
        });

        return successResponse(res, 'Nutrition comment updated successfully', updatedComment);
    } catch (error) {
        console.error('Error updating nutrition comment:', error);
        return errorResponse(res, 500, 'Failed to update nutrition comment');
    }
}

/**
 * Delete a nutrition comment
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;

        // Check if comment exists
        const existingComment = await NutritionComment.findById(commentId);
        if (!existingComment) {
            return errorResponse(res, 404, 'Nutrition comment not found');
        }

        // Delete comment
        await NutritionComment.delete(commentId);

        return successResponse(res, 'Nutrition comment deleted successfully');
    } catch (error) {
        console.error('Error deleting nutrition comment:', error);
        return errorResponse(res, 500, 'Failed to delete nutrition comment');
    }
}

/**
 * Delete all nutrition comments for a food
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function deleteCommentsByFood(req, res) {
    try {
        const { foodId } = req.params;

        // Check if food exists
        const food = await Food.findById(foodId);
        if (!food) {
            return errorResponse(res, 404, 'Food not found');
        }

        // Delete comments
        await NutritionComment.deleteByFoodId(foodId);

        return successResponse(res, 'Nutrition comments deleted successfully');
    } catch (error) {
        console.error('Error deleting nutrition comments:', error);
        return errorResponse(res, 500, 'Failed to delete nutrition comments');
    }
}

/**
 * Convert nutrient type for database storage
 * @param {String} nutrientType - Nutrient type from service
 * @returns {String} Nutrient type for database
 */
function convertNutrientTypeForDatabase(nutrientType) {
    const mapping = {
        protein: 'Protein',
        fat: 'Fat',
        carbs: 'Carb',
        fiber: 'Fiber',
        calories: 'Calorie'
    };

    return mapping[nutrientType] || nutrientType;
}

/**
 * Convert database nutrient type to service type
 * @param {String} databaseType - Nutrient type from database
 * @returns {String} Nutrient type for service
 */
function convertDatabaseTypeToNutrientType(databaseType) {
    const mapping = {
        'Protein': 'protein',
        'Fat': 'fat',
        'Carb': 'carbs',
        'Fiber': 'fiber',
        'Calorie': 'calories'
    };

    return mapping[databaseType] || databaseType.toLowerCase();
}

module.exports = {
    generateComments,
    getCommentsByFood,
    getCommentById,
    updateComment,
    deleteComment,
    deleteCommentsByFood
};
