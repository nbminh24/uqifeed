const geminiService = require('./geminiService');

/**
 * Image Processing Service
 * Handles image processing operations and extracts nutritional data
 */
class ImageProcessingService {
    /**
     * Process a base64 image and extract food information using Gemini API
     * @param {String} base64Image - Base64 encoded image string
     * @returns {Object} Processing results with food data
     */
    static async processImage(base64Image) {
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

            // Call Gemini API to analyze the food image
            const analysisResults = await geminiService.analyzeFoodImage(base64Image);

            // Return the analysis results
            return {
                processed: true,
                imageType: mimeType,
                imageSize: base64Data.length,
                foodData: analysisResults.foodData,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error processing image:', error);
            throw error;
        }
    }

    /**
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
servingSize: "1 cup (150g)"
                },
timestamp: new Date().toISOString()
            };
        } catch (error) {
    console.error('Error processing image:', error);
    throw error;
}
    }

    /**
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
