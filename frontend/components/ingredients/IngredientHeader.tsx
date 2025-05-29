import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface IngredientHeaderProps {
    name: string;
    createdAt: string;
}

export const IngredientHeader: React.FC<IngredientHeaderProps> = ({ name, createdAt }) => {
    return (
        <View style={styles.header}>
            <ThemedText style={styles.title}>{name}</ThemedText>
            <ThemedText style={styles.dateText}>{createdAt}</ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        paddingBottom: 10,
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    dateText: {
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
    },
});
