import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import WeeklyBarChart from './WeeklyBarChart';
import { NutrientAnalysis } from './nutrition-analysis/NutrientAnalysis';
import { WeeklyNutrition } from '@/services/weeklyNutritionService';

interface NutrientSectionProps {
    title: string;
    data: WeeklyNutrition['dailyData'];
    maxValue: number;
    color: string;
    nutritionType: 'calories' | 'proteins' | 'carbs' | 'fats';
    averageValue: number;
    targetValue: number;
    previousValue?: number;
    unit: string;
}

export const NutrientSection: React.FC<NutrientSectionProps> = ({
    title,
    data,
    maxValue,
    color,
    nutritionType,
    averageValue,
    targetValue,
    previousValue,
    unit
}) => {
    return (
        <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{title}</ThemedText>

            {/* Bar Chart */}
            <WeeklyBarChart
                data={data}
                maxValue={maxValue}
                nutritionType={nutritionType}
                color={color}
                title={title}
            />

            {/* Analysis */}
            <NutrientAnalysis
                nutrientType={title}
                current={averageValue}
                target={targetValue}
                previousValue={previousValue}
                unit={unit}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#163166',
        marginBottom: 12,
    },
});
