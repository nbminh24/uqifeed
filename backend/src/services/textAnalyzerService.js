/**
 * Text Food Analyzer Service
 * Handles text-based food analysis operations using Gemini AI
 */
const geminiService = require('./geminiService');

class TextAnalyzerService {
    /**
     * Process a text description and extract food information using Gemini API
     * @param {String} textDescription - Text description of the food
     * @returns {Object} Processing results with food data
     */
    static async processText(textDescription) {
        try {
            if (!textDescription) {
                throw new Error('No text description provided');
            }

            // Call Gemini API to analyze the food description
            const analysisResults = await geminiService.analyzeFoodText(textDescription);

            // Return the analysis results
            return {
                processed: true,
                foodData: analysisResults.foodData,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error processing food text description:', error);
            throw error;
        }
    }
}

module.exports = TextAnalyzerService;
