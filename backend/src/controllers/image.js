const Image = require('../models/image');
const UploadService = require('../services/uploadService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');

/**
 * Image Controller
 * Handles all image-related operations
 */
const ImageController = {
    /**
     * Upload and process a base64 image
     * @route POST /api/images/upload-and-process
     * @access Private
     */
    uploadAndProcessImage: async (req, res) => {
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

            // Upload image to Firebase Storage
            const imageUrl = await UploadService.uploadBase64Image(base64Image, 'user-images');

            // Process the image with external API
            const processingResults = await UploadService.processImageWithExternalAPI(imageUrl);

            // Save image data to database
            const imageData = {
                userId: req.user.id,
                url: imageUrl,
                processingResults,
                createdAt: new Date().toISOString()
            };

            const savedImage = await Image.save(imageData);

            return sendSuccessResponse(
                res,
                'Image uploaded and processed successfully',
                {
                    image: savedImage,
                    results: processingResults
                },
                201
            );
        } catch (error) {
            console.error('Image upload and processing error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error uploading and processing image',
                500
            );
        }
    },

    /**
     * Get user images
     * @route GET /api/images
     * @access Private
     */
    getUserImages: async (req, res) => {
        try {
            const images = await Image.findByUserId(req.user.id);

            return sendSuccessResponse(
                res,
                'User images retrieved successfully',
                { images }
            );
        } catch (error) {
            console.error('Get user images error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving user images',
                500
            );
        }
    },

    /**
     * Get image by ID
     * @route GET /api/images/:id
     * @access Private
     */
    getImageById: async (req, res) => {
        try {
            const image = await Image.findById(req.params.id);

            if (!image) {
                return sendErrorResponse(
                    res,
                    'Image not found',
                    404
                );
            }

            // Check if user owns the image or is admin
            if (image.userId !== req.user.id && req.user.role !== 'admin') {
                return sendErrorResponse(
                    res,
                    'Not authorized to access this image',
                    403
                );
            }

            return sendSuccessResponse(
                res,
                'Image retrieved successfully',
                { image }
            );
        } catch (error) {
            console.error('Get image error:', error);
            return sendErrorResponse(
                res,
                error.message || 'Error retrieving image',
                500
            );
        }
    }
};

module.exports = ImageController;

module.exports = ImageController;
