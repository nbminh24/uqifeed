import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface IngredientAmountProps {
    amount: string;
}

export const IngredientAmount: React.FC<IngredientAmountProps> = ({ amount }) => {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
                <ThemedText style={styles.sectionTitle}>Amount</ThemedText>
            </View>
            <View style={styles.amountContainer}>
                <Ionicons name="scale" size={24} color="#4CAF50" style={styles.icon} />
                <ThemedText style={styles.amountText}>{amount}</ThemedText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    amountText: {
        fontSize: 16,
        color: '#333',
    },
});
