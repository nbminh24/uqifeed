import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { format } from 'date-fns';
import { useThemeColor } from '@/hooks/useThemeColor';

interface FoodCardProps {
    id: string;
    name: string;
    mealTime: string;
    calories: number;
    imageUrl?: string;
}

export function FoodCard({ id, name, mealTime, calories, imageUrl }: FoodCardProps) {
    const cardBackground = useThemeColor(
        {
            light: '#FFFFFF',
            dark: '#1E2A3A',
        },
        'background'
    );

    const timeColor = useThemeColor(
        {
            light: '#666666',
            dark: '#9BA1A6',
        },
        'text'
    );

    const formattedTime = format(new Date(mealTime), 'HH:mm');

    const handlePress = () => {
        router.push({
            pathname: '/food-details',
            params: { id }
        });
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <ThemedView style={[styles.card, { backgroundColor: cardBackground }]}>
                {imageUrl && (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}
                <View style={styles.content}>
                    <ThemedText style={styles.name}>{name}</ThemedText>
                    <View style={styles.infoRow}>
                        <ThemedText style={[styles.time, { color: timeColor }]}>{formattedTime}</ThemedText>
                        <ThemedText style={styles.calories}>{calories} cal</ThemedText>
                    </View>
                </View>
            </ThemedView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    time: {
        fontSize: 14,
    },
    calories: {
        fontSize: 14,
        fontWeight: '500',
    }
});
