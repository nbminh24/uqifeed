const geminiService = require('./geminiService');
const CloudinaryService = require('./cloudinaryService');
const fs = require('fs');

/**
 * Image Processing Service
 * Handles image processing operations and extracts nutritional data
 */
class ImageProcessingService {
    /**
     * Process a base64 image and extract food information using Gemini API
     * @param {String} base64Image - Base64 encoded image string
     * @returns {Object} Processing results with food data
     */    static async processImage(base64Image, userId) {
        try {
            if (!base64Image) {
                throw new Error('No base64 image provided');
            }

            // Extract the mime type and actual base64 data
            const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

            if (!matches || matches.length !== 3) {
                throw new Error('Invalid base64 string');
            }

            const mimeType = matches[1];
            const base64Data = matches[2];

            // Upload image to Cloudinary
            const cloudinaryResult = await CloudinaryService.uploadImage(base64Image, userId);

            // Call Gemini API to analyze the food image
            const analysisResults = await geminiService.analyzeFoodImage(base64Image);

            // Return the analysis results with Cloudinary info
            return {
                processed: true,
                imageType: mimeType,
                imageSize: base64Data.length,
                foodData: analysisResults.foodData,
                cloudinaryInfo: {
                    url: cloudinaryResult.url,
                    publicId: cloudinaryResult.publicId
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error processing image:', error);
            throw error;
        }
    }

    /**
     * Process an uploaded image file and extract food information using Gemini API
     * @param {Object} file - Uploaded file object from Multer
     * @returns {Object} Processing results with food data
     */    static async processUploadedImage(file, userId) {
        try {
            if (!file) {
                throw new Error('No file uploaded');
            }

            // Upload image to Cloudinary directly from buffer
            const cloudinaryResult = await CloudinaryService.uploadImage(file.buffer, userId);

            // Convert file buffer to base64 for Gemini analysis
            const base64Data = file.buffer.toString('base64');
            const mimeType = file.mimetype;
            const base64Image = `data:${mimeType};base64,${base64Data}`;

            // Call Gemini API to analyze the food image
            const analysisResults = await geminiService.analyzeFoodImage(base64Image);

            // Return the analysis results with Cloudinary info
            return {
                processed: true,
                imageType: mimeType,
                imageSize: file.size,
                fileName: file.originalname,
                foodData: analysisResults.foodData,
                cloudinaryInfo: {
                    url: cloudinaryResult.url,
                    publicId: cloudinaryResult.publicId
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error processing uploaded image:', error);
            throw error;
        }
    }    /**
     * Extract base64 data and mime type from a base64 image string
     * @param {String} base64Image - Base64 encoded image string
     * @returns {Object} Object containing mime type and base64 data
     */
    static extractBase64Data(base64Image) {
        if (!base64Image) {
            throw new Error('No base64 image provided');
        }

        // Extract the mime type and actual base64 data
        const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 string');
        }

        return {
            mimeType: matches[1],
            data: matches[2]
        };
    }
}

module.exports = ImageProcessingService;
