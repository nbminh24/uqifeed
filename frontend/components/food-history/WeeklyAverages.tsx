import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { format } from 'date-fns';
import { DailyNutrition } from '@/services/weeklyNutritionService';

interface WeeklyAveragesProps {
    averages: DailyNutrition;
}

const WeeklyAverages: React.FC<WeeklyAveragesProps> = ({ averages }) => {
    return (
        <View style={styles.averagesContainer}>
            <ThemedText style={styles.sectionTitle}>Weekly Averages</ThemedText>
            <View style={styles.averagesGrid}>
                <View style={styles.averageItem}>
                    <ThemedText style={styles.averageValue}>{averages.calories}</ThemedText>
                    <ThemedText style={styles.averageLabel}>Calories</ThemedText>
                </View>
                <View style={styles.averageItem}>
                    <ThemedText style={styles.averageValue}>{averages.proteins}g</ThemedText>
                    <ThemedText style={styles.averageLabel}>Protein</ThemedText>
                </View>
                <View style={styles.averageItem}>
                    <ThemedText style={styles.averageValue}>{averages.carbs}g</ThemedText>
                    <ThemedText style={styles.averageLabel}>Carbs</ThemedText>
                </View>
                <View style={styles.averageItem}>
                    <ThemedText style={styles.averageValue}>{averages.fats}g</ThemedText>
                    <ThemedText style={styles.averageLabel}>Fat</ThemedText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    averagesContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    averagesGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    averageItem: {
        alignItems: 'center',
        minWidth: '25%',
    },
    averageValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#163166',
    },
    averageLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});

export default WeeklyAverages;
