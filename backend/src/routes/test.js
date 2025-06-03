const express = require('express');
const router = express.Router();
const CloudinaryService = require('../services/cloudinaryService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');
const { authenticate } = require('../middleware/auth');

/**
 * Test upload ảnh lên Cloudinary
 * @route POST /api/test/cloudinary-upload
 * @access Private
 */
router.post('/cloudinary-upload', authenticate, async (req, res) => {
    try {
        const { base64Image } = req.body;

        if (!base64Image) {
            return sendErrorResponse(res, 'No image provided', 400);
        }

        // Upload ảnh lên Cloudinary
        const result = await CloudinaryService.uploadImage(base64Image, req.user.id);

        return sendSuccessResponse(res, 'Image uploaded successfully', { imageInfo: result });
    } catch (error) {
        console.error('Cloudinary upload test error:', error);
        return sendErrorResponse(res, 'Error uploading image', 500);
    }
});

module.exports = router;
