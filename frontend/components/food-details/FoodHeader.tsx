import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FoodHeaderProps {
    title: string;
    date: string;
}

export const FoodHeader: React.FC<FoodHeaderProps> = ({ title, date }) => {
    return (
        <View style={styles.header}>
            <ThemedText type="title" style={styles.foodTitle}>{title}</ThemedText>
            <ThemedText style={styles.dateText}>{date}</ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        paddingBottom: 10,
        alignItems: 'center',
    },
    foodTitle: {
        fontSize: 22,
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
});
