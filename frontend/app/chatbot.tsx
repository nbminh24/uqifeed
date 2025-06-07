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
    Image,
    Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChatBubble } from '../components/ChatBubble';
import { ThemedView } from '../components/ThemedView';
import { useThemeColor } from '../hooks/useThemeColor';
import chatbotService, { ChatMessage } from '../services/chatbotService';

const { inline: screenWidth } = Dimensions.get('window');
const MASCOT_SIZE = screenWidth * 0.5; // Increased from 0.4 to 0.5

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mascotHeader: {
        paddingBlock: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBlockEnd: 10, // Added margin to push content up
    },
    backButton: {
        position: 'absolute',
        insetInlineStart: 10,
        insetBlockStart: Platform.OS === 'ios' ? 40 : 10,
        zIndex: 1,
        padding: 10,
    },
    mascotContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBlockStart: Platform.OS === 'ios' ? 30 : 0,
    },
    mascotFrame: {
        inlineSize: MASCOT_SIZE,
        blockSize: MASCOT_SIZE,
        borderRadius: MASCOT_SIZE / 2,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    mascot: {
        inlineSize: '100%',
        blockSize: '100%',
    },
    keyboardAvoid: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
        paddingInline: 16,
        paddingBlockEnd: 16, // Added padding to lift content
    },
    scrollView: {
        flex: 1,
        marginBlockEnd: 8, // Added margin to create space
    },
    scrollContent: {
        flexGrow: 1,
        paddingBlock: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingBlock: 12, // Increased padding
        paddingInline: 16,
        alignItems: 'center',
        borderBlockStartWidth: StyleSheet.hairlineWidth,
        borderBlockStartColor: '#ccc',
        backgroundColor: Platform.select({ ios: '#F8F8F8', android: '#FFFFFF' }), // Added background color
    },
    input: {
        flex: 1,
        blockSize: 40,
        marginInlineEnd: 8,
        paddingInline: 12,
        borderRadius: 20,
        borderColor: '#ccc',
        borderInlineSize: StyleSheet.hairlineWidth,
    },
    sendButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: Platform.select({ ios: '#007AFF', android: '#2196F3' }),
    },
    loadingContainer: {
        paddingBlock: 10,
        alignItems: 'center',
    },
    loading: {
        marginBlock: 8,
    },
});

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
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <View style={styles.mascotHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={primaryColor} />
                </TouchableOpacity>
                <View style={styles.mascotContainer}>
                    <View style={styles.mascotFrame}>
                        <Image
                            source={{ uri: 'https://cdn.dribbble.com/userupload/33219605/file/original-3e652baea723121800ca0068452af00e.gif' }}
                            style={styles.mascot}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <View style={styles.messagesContainer}>
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {messages.map((message) => (
                            <ChatBubble
                                key={message.id}
                                message={message.text}
                                isUser={message.isUser}
                            />
                        ))}
                        {isLoading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator
                                    style={styles.loading}
                                    size="small"
                                    color={primaryColor}
                                />
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, { color: inputColor }]}
                            value={inputMessage}
                            onChangeText={setInputMessage}
                            placeholder="Type a message..."
                            placeholderTextColor="#999"
                            multiline
                            maxLength={1000}
                            onSubmitEditing={sendMessage}
                        />
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={sendMessage}
                            disabled={isLoading || !inputMessage.trim()}
                        >
                            <Ionicons name="send" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}
