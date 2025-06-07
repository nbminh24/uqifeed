import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChatBubble } from '../components/ChatBubble';
import { ThemedView } from '../components/ThemedView';
import { useThemeColor } from '../hooks/useThemeColor';
import chatbotService, { ChatMessage } from '../services/chatbotService';

export default function ChatbotScreen() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            text: 'Hi! I\'m your nutrition assistant. Ask me anything about food and nutrition!',
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const inputColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const primaryColor = useThemeColor({}, 'primary');

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: inputMessage.trim(),
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await chatbotService.sendMessage(inputMessage);
            const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: response,
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I encountered an error. Please try again.',
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Nutrition Assistant',
                    headerBackTitle: 'Back',
                }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.scrollContent}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
                >
                    {messages.map((message) => (
                        <ChatBubble
                            key={message.id}
                            message={message.text}
                            isUser={message.isUser}
                        />
                    ))}
                    {isLoading && (
                        <ActivityIndicator
                            style={styles.loading}
                            size="small"
                            color={primaryColor}
                        />
                    )}
                </ScrollView>

                <View style={[styles.inputContainer, { backgroundColor }]}>
                    <TextInput
                        style={[styles.input, { color: inputColor }]}
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        placeholder="Type your message..."
                        placeholderTextColor="#666"
                        multiline
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        style={[
                            styles.sendButton,
                            { opacity: !inputMessage.trim() || isLoading ? 0.5 : 1 }
                        ]}
                    >
                        <Ionicons name="send" size={24} color={primaryColor} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    scrollContent: {
        flexGrow: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        marginRight: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
    },
    sendButton: {
        padding: 8,
    },
    loading: {
        padding: 8,
        alignSelf: 'center',
    },
});
