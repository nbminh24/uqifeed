const Ingredient = require('../models/ingredient');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');

/**
 * Delete all ingredients for a food item
 * @route DELETE /api/foods/:foodId/ingredients
 * @access Private
 */
const deleteIngredients = async (req, res) => {
    try {
        const { foodId } = req.params;

        // Delete all ingredients for this food
        await Ingredient.deleteByFoodId(foodId);

        return sendSuccessResponse(
            res,
            'Ingredients deleted successfully'
        );
    } catch (error) {
        console.error('Error deleting ingredients:', error);
        return sendErrorResponse(
            res,
            error.message || 'Error deleting ingredients',
            500
        );
    }
};

module.exports = {
    deleteIngredients
};
