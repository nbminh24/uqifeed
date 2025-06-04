import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function IngredientDetailScreen() {
    const { id } = useLocalSearchParams();

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Ingredient Detail',
                }}
            />
            <ScrollView style={styles.scrollView}>
                <View style={styles.contentContainer}>
                    <ThemedText style={styles.title}>Ingredient ID: {id}</ThemedText>
                    {/* Thêm các thông tin chi tiết của ingredient ở đây */}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    }, title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
});
