const Image = require('../models/image');
const ImageProcessingService = require('../services/uploadService');
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
    }
};

module.exports = ImageAnalyzerController;
