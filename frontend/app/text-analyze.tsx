import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function TextAnalyzeScreen() {
    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{
                title: 'Text Analyze',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#163166',
                },
                headerTintColor: '#fff',
            }} />
            <ThemedText type="title">Text Analyze Screen</ThemedText>
            <ThemedText>This screen will contain text analysis functionality.</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});
