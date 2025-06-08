import React from 'react';
import { StyleSheet, View, ScrollView, Platform, TouchableOpacity, Text } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

export default function IngredientDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            {/* Custom Header */}
            <View style={styles.header}>                <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
                <View style={styles.headerTitle}>
                    <Text style={styles.foodName}>Ingredient Details</Text>
                    <Text style={styles.timeText}>Nutrition Information</Text>
                </View>
            </View>            <ScrollView style={styles.scrollView}>
                <View style={styles.contentContainer}>
                    <ThemedText style={styles.title}>Ingredient ID: {id}</ThemedText>
                    {/* Add ingredient details here */}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
        paddingTop: Platform.OS === 'ios' ? 70 : 50,
    }, header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 16,
    },
    backButton: {
        padding: 4,
    }, headerTitle: {
        flex: 1,
        marginLeft: 12,
    },
    foodName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    timeText: {
        fontSize: 13,
        color: '#6B7280',
    },
    headerRight: {
        width: 24, // To balance the back button
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 8,
    },
});
