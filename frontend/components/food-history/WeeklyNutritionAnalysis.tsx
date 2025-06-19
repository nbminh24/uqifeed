import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { WeeklyNutrition } from '@/services/weeklyNutritionService';
import { NutrientSection } from './NutrientSection';

// Default daily targets (you can make these configurable later)
const DAILY_TARGETS = {
    calories: 2000,
    proteins: 60, // grams
    carbs: 250, // grams
    fats: 65, // grams
};

// Chart colors
const CHART_COLORS = {
    calories: '#FF6B6B',  // Red
    proteins: '#4ECDC4',  // Teal
    carbs: '#45B7D1',    // Blue
    fats: '#96CEB4',     // Green
};

interface WeeklyNutritionAnalysisProps {
    weeklyData: WeeklyNutrition;
    previousWeekData?: WeeklyNutrition | null;
}

export const WeeklyNutritionAnalysis: React.FC<WeeklyNutritionAnalysisProps> = ({
    weeklyData,
    previousWeekData
}) => {
    // Calculate max values for charts
    const maxValues = {
        calories: Math.max(...Object.values(weeklyData.dailyData).map(d => d.calories || 0)) || DAILY_TARGETS.calories,
        proteins: Math.max(...Object.values(weeklyData.dailyData).map(d => d.proteins || 0)) || DAILY_TARGETS.proteins,
        carbs: Math.max(...Object.values(weeklyData.dailyData).map(d => d.carbs || 0)) || DAILY_TARGETS.carbs,
        fats: Math.max(...Object.values(weeklyData.dailyData).map(d => d.fats || 0)) || DAILY_TARGETS.fats,
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <ThemedText style={styles.title}>Weekly Nutrition Report</ThemedText>

                <NutrientSection
                    title="Calories"
                    data={weeklyData.dailyData}
                    maxValue={maxValues.calories}
                    color={CHART_COLORS.calories}
                    nutritionType="calories"
                    averageValue={weeklyData.averages.calories}
                    targetValue={DAILY_TARGETS.calories}
                    previousValue={previousWeekData?.averages.calories}
                    unit="kcal"
                />

                <NutrientSection
                    title="Protein"
                    data={weeklyData.dailyData}
                    maxValue={maxValues.proteins}
                    color={CHART_COLORS.proteins}
                    nutritionType="proteins"
                    averageValue={weeklyData.averages.proteins}
                    targetValue={DAILY_TARGETS.proteins}
                    previousValue={previousWeekData?.averages.proteins}
                    unit="g"
                />

                <NutrientSection
                    title="Carbs"
                    data={weeklyData.dailyData}
                    maxValue={maxValues.carbs}
                    color={CHART_COLORS.carbs}
                    nutritionType="carbs"
                    averageValue={weeklyData.averages.carbs}
                    targetValue={DAILY_TARGETS.carbs}
                    previousValue={previousWeekData?.averages.carbs}
                    unit="g"
                />

                <NutrientSection
                    title="Fats"
                    data={weeklyData.dailyData}
                    maxValue={maxValues.fats}
                    color={CHART_COLORS.fats}
                    nutritionType="fats"
                    averageValue={weeklyData.averages.fats}
                    targetValue={DAILY_TARGETS.fats}
                    previousValue={previousWeekData?.averages.fats}
                    unit="g"
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#163166',
        textAlign: 'center',
        marginBottom: 24,
    },
});
