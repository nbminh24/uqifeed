import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface MacroData {
    carbs: number;
    fats: number;
    protein: number;
}

interface CaloriesAndMacrosProps {
    calories: number;
    macros: MacroData;
}

export const CaloriesAndMacros: React.FC<CaloriesAndMacrosProps> = ({ calories, macros }) => {
    return (
        <View style={styles.nutritionCard}>
            <View style={styles.nutritionHeaderRow}>
                <ThemedText style={styles.sectionTitle}>Calories & macros</ThemedText>
            </View>

            <View style={styles.caloriesRow}>
                <Ionicons name="flame" size={24} color="#FF6B6B" />
                <ThemedText type="title" style={styles.caloriesValue}>{calories}</ThemedText>
                <ThemedText style={styles.caloriesUnit}>kcal</ThemedText>
            </View>

            <View style={styles.macrosBars}>
                <View style={styles.carbsBar}></View>
                <View style={styles.fatsBar}></View>
                <View style={styles.proteinsBar}></View>
            </View>

            <View style={styles.macrosLegendRow}>
                <View style={styles.macroLegendItem}>
                    <View style={[styles.macroLegendDot, styles.carbsDot]}></View>
                    <ThemedText style={styles.macroLegendTitle}>Carbs</ThemedText>
                    <ThemedText style={styles.macroValue}>{macros.carbs}g</ThemedText>
                </View>

                <View style={styles.macroLegendItem}>
                    <View style={[styles.macroLegendDot, styles.fatsDot]}></View>
                    <ThemedText style={styles.macroLegendTitle}>Fats</ThemedText>
                    <ThemedText style={styles.macroValue}>{macros.fats}g</ThemedText>
                </View>

                <View style={styles.macroLegendItem}>
                    <View style={[styles.macroLegendDot, styles.proteinsDot]}></View>
                    <ThemedText style={styles.macroLegendTitle}>Proteins</ThemedText>
                    <ThemedText style={styles.macroValue}>{macros.protein}g</ThemedText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    nutritionCard: {
        margin: 16,
        padding: 16,
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
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    caloriesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    caloriesValue: {
        fontSize: 32,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    caloriesUnit: {
        fontSize: 16,
        color: '#888',
        marginLeft: 4,
        alignSelf: 'flex-end',
        marginBottom: 4,
    },
    macrosBars: {
        height: 8,
        flexDirection: 'row',
        marginBottom: 16,
    },
    carbsBar: {
        flex: 1,
        height: '100%',
        backgroundColor: '#FFD166',
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    fatsBar: {
        flex: 5,
        height: '100%',
        backgroundColor: '#06D6A0',
    },
    proteinsBar: {
        flex: 10,
        height: '100%',
        backgroundColor: '#118AB2',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
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
