import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface NutritionInfoProps {
    nutritionInfo: {
        carb: number;
        fat: number;
        protein: number;
        fiber: number;
    };
}

export const NutritionInfo: React.FC<NutritionInfoProps> = ({ nutritionInfo }) => {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
                <ThemedText style={styles.sectionTitle}>Nutrition Information</ThemedText>
            </View>
            <View style={styles.nutritionContainer}>
                <View style={styles.nutritionItem}>
                    <Ionicons name="nutrition" size={24} color="#FFD166" style={styles.icon} />
                    <ThemedText style={styles.nutritionLabel}>Carbs</ThemedText>
                    <ThemedText style={styles.nutritionValue}>{nutritionInfo.carb} g</ThemedText>
                </View>
                <View style={styles.nutritionItem}>
                    <Ionicons name="water" size={24} color="#06D6A0" style={styles.icon} />
                    <ThemedText style={styles.nutritionLabel}>Fat</ThemedText>
                    <ThemedText style={styles.nutritionValue}>{nutritionInfo.fat} g</ThemedText>
                </View>
                <View style={styles.nutritionItem}>
                    <Ionicons name="barbell" size={24} color="#118AB2" style={styles.icon} />
                    <ThemedText style={styles.nutritionLabel}>Protein</ThemedText>
                    <ThemedText style={styles.nutritionValue}>{nutritionInfo.protein} g</ThemedText>
                </View>
                <View style={styles.nutritionItem}>
                    <Ionicons name="leaf" size={24} color="#8BC34A" style={styles.icon} />
                    <ThemedText style={styles.nutritionLabel}>Fiber</ThemedText>
                    <ThemedText style={styles.nutritionValue}>{nutritionInfo.fiber} g</ThemedText>
                </View>
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
    nutritionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    nutritionItem: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#F9F9F9',
        padding: 10,
        borderRadius: 8,
    },
    icon: {
        marginRight: 8,
    },
    nutritionLabel: {
        flex: 1,
        fontSize: 14,
        color: '#555',
    },
    nutritionValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
});
