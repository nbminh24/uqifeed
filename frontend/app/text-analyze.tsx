import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';

export default function TextAnalyzeScreen() {
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!text.trim()) {
            setError('Please enter some text to analyze');
            return;
        }
        setError('');
        setIsAnalyzing(true);
        // TODO: Add analysis logic here
        setIsAnalyzing(false);
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{
                title: 'Text Analysis',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#163166',
                },
                headerTintColor: '#fff',
            }} />

            <ThemedView style={styles.contentContainer}>
                <ThemedText style={styles.description}>
                    Enter your food description here for nutritional analysis
                </ThemedText>

                <TextInput
                    style={styles.textInput}
                    multiline
                    numberOfLines={6}
                    placeholder="Example: 2 cups of rice, 1 chicken breast, and a bowl of vegetables..."
                    placeholderTextColor="#999"
                    value={text}
                    onChangeText={setText}
                />

                {error ? (
                    <ThemedText style={styles.errorText}>{error}</ThemedText>
                ) : null}                <Button
                    title={isAnalyzing ? "Analyzing..." : "Analyze Text"}
                    onPress={handleAnalyze}
                    disabled={isAnalyzing || !text.trim()}
                    style={styles.analyzeButton}
                />
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
        width: '100%',
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 16,
        textAlign: 'center',
    },
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        minHeight: 150,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        textAlignVertical: 'top',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    analyzeButton: {
        backgroundColor: '#163166',
        borderRadius: 12,
        paddingVertical: 14,
        width: '100%',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    errorText: {
        color: '#dc3545',
        fontSize: 14,
        marginBottom: 8,
    }
});
