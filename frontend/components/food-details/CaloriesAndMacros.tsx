import React from 'react';
import { StyleSheet, View, StyleSheet as RNStyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface CaloriesAndMacrosProps {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export const CaloriesAndMacros: React.FC<CaloriesAndMacrosProps> = ({ calories, protein, carbs, fats }) => {
    // Calculate percentages for the bars
    const total = protein + carbs + fats;
    const proteinPercentage = total > 0 ? (protein / total) * 100 : 0;
    const carbsPercentage = total > 0 ? (carbs / total) * 100 : 0;
    const fatsPercentage = total > 0 ? (fats / total) * 100 : 0;

    // Create dynamic styles for bars
    const dynamicStyles = StyleSheet.create({
        proteinsBarWidth: {
            width: `${proteinPercentage}%`,
        },
        fatsBarWidth: {
            width: `${fatsPercentage}%`,
        },
        carbsBarWidth: {
            width: `${carbsPercentage}%`,
        },
    });

    return (
        <View style={styles.nutritionCard}>
            <View style={styles.nutritionHeaderRow}>
                <ThemedText style={styles.sectionTitle}>Calories & macros</ThemedText>
            </View>
            <View style={styles.caloriesRow}>
                <View style={styles.caloriesIconContainer}>
                    <Ionicons name="flame" size={36} color="#FF6B6B" />
                </View>
                <ThemedText style={styles.caloriesValue}>{Math.round(calories) || 0}</ThemedText>
                <ThemedText style={styles.caloriesUnit}>kcal</ThemedText>
            </View>

            <View style={styles.macrosBars}>
                <View style={[styles.proteinsBar, dynamicStyles.proteinsBarWidth]}></View>
                <View style={[styles.fatsBar, dynamicStyles.fatsBarWidth]}></View>
                <View style={[styles.carbsBar, dynamicStyles.carbsBarWidth]}></View>
            </View>

            <View style={styles.macrosLegendRow}>
                <View style={styles.macroLegendItem}>
                    <View style={[styles.macroLegendDot, styles.carbsDot]}></View>
                    <ThemedText style={styles.macroLegendTitle}>Carbs</ThemedText>
                    <ThemedText style={styles.macroValue}>{carbs || 0}g</ThemedText>
                </View>

                <View style={styles.macroLegendItem}>
                    <View style={[styles.macroLegendDot, styles.fatsDot]}></View>
                    <ThemedText style={styles.macroLegendTitle}>Fats</ThemedText>
                    <ThemedText style={styles.macroValue}>{fats || 0}g</ThemedText>
                </View>

                <View style={styles.macroLegendItem}>
                    <View style={[styles.macroLegendDot, styles.proteinsDot]}></View>
                    <ThemedText style={styles.macroLegendTitle}>Protein</ThemedText>
                    <ThemedText style={styles.macroValue}>{protein || 0}g</ThemedText>
                </View>
            </View>
        </View>
    );
};

const styles = RNStyleSheet.create({
    nutritionCard: {
        margin: 12,
        padding: 16,
        paddingTop: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    nutritionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 3,
    },
    caloriesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
        paddingHorizontal: 8,
        paddingVertical: 3,
        minHeight: 50,
    },
    caloriesIconContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    caloriesValue: {
        fontSize: 34,
        fontWeight: 'bold',
        marginLeft: 8,
        lineHeight: 40,
    },
    caloriesUnit: {
        fontSize: 16,
        color: '#888',
        marginLeft: 4,
        alignSelf: 'flex-end',
        marginBottom: 8,
    },
    macrosBars: {
        height: 8,
        marginBottom: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
    },
    carbsBar: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#FFD166',
        left: 0,
    },
    fatsBar: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#06D6A0',
        left: 0,
    },
    proteinsBar: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#118AB2',
        left: 0,
    },
    macrosLegendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    macroLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    macroLegendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    carbsDot: {
        backgroundColor: '#FFD166',
    },
    fatsDot: {
        backgroundColor: '#06D6A0',
    },
    proteinsDot: {
        backgroundColor: '#118AB2',
    },
    macroLegendTitle: {
        fontSize: 14,
        color: '#666',
        marginRight: 4,
    },
    macroValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
