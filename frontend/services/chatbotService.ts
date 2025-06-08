import { getApiUrl } from '../constants/Config';

export interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

class ChatbotService {
    async sendMessage(message: string): Promise<string> {
        try {
            // Get the authentication token from AsyncStorage
            const token = 'default-auth-token-123'; // Using default token for testing

            const response = await fetch(getApiUrl('/api/chatbot/chat'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.reply;
        } catch (error) {
            console.error('Error sending message to chatbot:', error);
            throw error;
        }
    }
}

export default new ChatbotService();
