const Image = require('../models/image');
const ImageProcessingService = require('../services/uploadService');
const DirectNutritionProcessor = require('../services/directNutritionProcessor');
const TargetNutrition = require('../models/targetNutrition');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');

/**
 * Image Analyzer Controller
 * Handles food image analysis operations using Gemini AI
 */
const ImageAnalyzerController = {
    /**
     * Process a base64 food image with Gemini AI
     * @route POST /api/images/analyze-food
     * @access Private
     */
    analyzeFoodImage: async (req, res) => {
        try {
            const { base64Image } = req.body;

            // Check if base64 image exists
            if (!base64Image) {
                return sendErrorResponse(
                    res,
                    'No image provided',
                    400
                );
            }

            // Process the image using Gemini API
            const processingResults = await ImageProcessingService.processImage(base64Image);

            // Save image data to database
            const imageData = {
                userId: req.user.id,
                base64Image,
                processingResults,
                createdAt: new Date().toISOString()
            };

            const savedImage = await Image.save(imageData);

            return sendSuccessResponse(
                res,
                'Food image analyzed successfully',
                {
                    image: savedImage,
                    foodData: processingResults.foodData
                },
                201
            );
        } catch (error) {
            console.error('Food image analysis error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error analyzing food image',
                500
            );
        }
    },

    /**
     * Analyze a food image without saving to database
     * @route POST /api/images/analyze-food-only
     * @access Private
     */
    analyzeFoodImageOnly: async (req, res) => {
        try {
            const { base64Image } = req.body;

            // Check if base64 image exists
            if (!base64Image) {
                return sendErrorResponse(
                    res,
                    'No image provided',
                    400
                );
            }

            // Process the image using Gemini API
            const processingResults = await ImageProcessingService.processImage(base64Image);

            return sendSuccessResponse(
                res,
                'Food image analyzed successfully',
                {
                    foodData: processingResults.foodData
                }
            );
        } catch (error) {
            console.error('Food image analysis error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error analyzing food image',
                500
            );
        }
    },

    /**
     * Analyze food image and calculate nutrition values, score, and comments without saving to database
     * @route POST /api/food-analysis/analyze-complete
     * @access Private
     */
    analyzeComplete: async (req, res) => {
        try {
            const { base64Image, meal_type_id } = req.body;

            // Validate required fields
            if (!base64Image) {
                return sendErrorResponse(
                    res,
                    'Image is required',
                    400
                );
            }

            if (!meal_type_id) {
                return sendErrorResponse(
                    res,
                    'Meal type ID is required',
                    400
                );
            }            // Get target nutrition for the user
            const targetNutrition = await TargetNutrition.findByUserId(req.user.id);
            if (!targetNutrition) {
                return sendErrorResponse(
                    res,
                    'Target nutrition not found. Please calculate your nutrition targets first.',
                    404
                );
            }

            // Process the image using Gemini API
            const processingResults = await ImageProcessingService.processImage(base64Image);

            if (!processingResults || !processingResults.foodData) {
                return sendErrorResponse(
                    res,
                    'Failed to analyze food image',
                    500
                );
            }

            const foodData = processingResults.foodData;

            // Process complete nutrition analysis
            const completeAnalysis = DirectNutritionProcessor.processComplete(
                foodData,
                targetNutrition,
                meal_type_id
            );

            // Add original image and metadata to the result
            completeAnalysis.food.food_image = base64Image;
            completeAnalysis.food.meal_type_id = meal_type_id;
            completeAnalysis.food.user_id = req.user.id;

            return sendSuccessResponse(
                res,
                'Food image analyzed completely',
                {
                    analysis: completeAnalysis,
                    originalData: foodData
                }
            );
        } catch (error) {
            console.error('Error in complete food image analysis:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error analyzing food image completely',
                500
            );
        }
    },
};

module.exports = ImageAnalyzerController;
