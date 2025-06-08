const { GoogleGenerativeAI } = require('@google/generative-ai');
const nutritionContext = `You are a nutrition expert assistant. Your role is to:
1. Answer questions about nutrition, food, and healthy eating
2. Provide science-based advice about diet and nutrition
3. Help users understand nutritional values and make healthy food choices
4. Stay focused on nutrition and health-related topics
5. Keep answers concise, friendly, and easy to understand

Do not:
1. Give medical advice or diagnose conditions
2. Recommend specific medications or treatments
3. Make promises about weight loss or health outcomes
4. Discuss topics unrelated to nutrition and healthy eating`;

class ChatbotController {
    constructor() {
        // Load environment variables if not already loaded
        require('dotenv').config();

        // Get API key from environment variables
        const apiKey = process.env.CHATBOT_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('CHATBOT_GEMINI_API_KEY is not defined in environment variables');
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    async chat(req, res) {
        try {
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({ error: 'Message is required' });
            }

            // Combine context and user message
            const prompt = `${nutritionContext}\n\nUser: ${message}\nAssistant:`;

            // Generate response using flash model
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            res.json({ reply: text });
        } catch (error) {
            console.error('Chatbot error:', error);
            res.status(500).json({
                error: 'Failed to get response from chatbot',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = new ChatbotController();
