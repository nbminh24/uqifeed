import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';

interface ChatBubbleProps {
    message: string;
    isUser: boolean;
}

export function ChatBubble({ message, isUser }: ChatBubbleProps) {
    const backgroundColor = useThemeColor({}, isUser ? 'primary' : 'secondaryBackground');
    const textColor = useThemeColor({}, isUser ? 'background' : 'text');

    return (
        <View style={[
            styles.bubble,
            { backgroundColor },
            isUser ? styles.userBubble : styles.botBubble
        ]}>
            <ThemedText style={[styles.text, { color: textColor }]}>
                {message}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    bubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        marginVertical: 4,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    userBubble: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    botBubble: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    text: {
        fontSize: 16,
        lineHeight: 20,
    },
});
