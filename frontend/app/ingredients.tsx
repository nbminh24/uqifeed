import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function IngredientScreen() {
    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{
                title: 'Ingredients',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#163166',
                },
                headerTintColor: '#fff',
            }} />
            <ThemedText type="title">Ingredients Screen</ThemedText>
            <ThemedText>This screen will contain ingredients management functionality.</ThemedText>
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
