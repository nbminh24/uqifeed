import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { WeeklyNutrition } from '@/services/weeklyNutritionService';

// Default daily targets (you can make these configurable later)
const DAILY_TARGETS = {
    calories: 2000,
    proteins: 60, // grams
    carbs: 250, // grams
    fats: 65, // grams
};

interface WeeklyNutritionAnalysisProps {
    weeklyData: WeeklyNutrition;
    previousWeekData?: WeeklyNutrition | null;
}

export const WeeklyNutritionAnalysis: React.FC<WeeklyNutritionAnalysisProps> = ({
    weeklyData,
    previousWeekData
}) => {
    const calculateProgress = (actual: number, target: number) => {
        return Math.round((actual / target) * 100);
    };

    const getTrend = (current: number, previous?: number) => {
        if (!previous) return 'N/A';
        const diff = current - previous;
        if (Math.abs(diff) < 0.1) return 'stable';
        return diff > 0 ? 'increasing' : 'decreasing';
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 90 && percentage <= 110) return '#4CAF50'; // Good range
        if (percentage < 70 || percentage > 130) return '#F44336'; // Too low/high
        return '#FF9800'; // Moderate
    };

    const renderNutrientAnalysis = (
        nutrient: 'calories' | 'proteins' | 'carbs' | 'fats',
        label: string,
        unit: string
    ) => {
        const average = weeklyData.averages[nutrient];
        const previousAverage = previousWeekData?.averages[nutrient];
        const target = DAILY_TARGETS[nutrient];
        const progress = calculateProgress(average, target);
        const trend = getTrend(average, previousAverage);
        const color = getProgressColor(progress);

        return (
            <View style={styles.nutrientContainer}>
                <View style={styles.nutrientHeader}>
                    <ThemedText style={styles.nutrientLabel}>{label}</ThemedText>
                    <ThemedText style={[styles.progressText, { color }]}>
                        {progress}%
                    </ThemedText>
                </View>

                <View style={styles.detailsContainer}>
                    <ThemedText style={styles.detailText}>
                        Average: {average.toFixed(1)}{unit} / {target}{unit} daily
                    </ThemedText>
                    <ThemedText style={styles.trendText}>
                        Trend: {trend} {previousAverage
                            ? `(${Math.abs(average - previousAverage).toFixed(1)}${unit} ${average > previousAverage ? 'more' : 'less'})`
                            : ''}
                    </ThemedText>
                </View>

                <View style={styles.recommendationContainer}>
                    <ThemedText style={styles.recommendationText}>
                        {progress >= 90 && progress <= 110
                            ? `✓ Good job maintaining your ${label.toLowerCase()} intake!`
                            : progress < 90
                                ? `! Try to increase your ${label.toLowerCase()} intake`
                                : `! Consider reducing your ${label.toLowerCase()} intake`}
                    </ThemedText>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>Nutrition Analysis</ThemedText>

            {renderNutrientAnalysis('calories', 'Calories', 'kcal')}
            {renderNutrientAnalysis('proteins', 'Protein', 'g')}
            {renderNutrientAnalysis('carbs', 'Carbs', 'g')}
            {renderNutrientAnalysis('fats', 'Fats', 'g')}

            {/* Overall recommendation */}
            <View style={styles.overallContainer}>
                <ThemedText style={styles.overallTitle}>Weekly Summary</ThemedText>
                <ThemedText style={styles.overallText}>
                    {weeklyData.averages.calories > DAILY_TARGETS.calories * 1.1
                        ? 'Your calorie intake is above target. Focus on portion control and choosing nutrient-dense foods.'
                        : weeklyData.averages.calories < DAILY_TARGETS.calories * 0.9
                            ? 'Your calorie intake is below target. Consider increasing your portions or adding healthy snacks.'
                            : 'You\'re maintaining a good balance of nutrition. Keep up the good work!'}
                </ThemedText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        margin: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
        color: '#163166',
        textAlign: 'center',
    },
    nutrientContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#163166',
    }, nutrientHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    nutrientLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#163166',
    },
    progressText: {
        fontSize: 20,
        fontWeight: '700',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
    },
    detailsContainer: {
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
    },
    detailText: {
        fontSize: 15,
        color: '#444',
        marginBottom: 6,
    },
    trendText: {
        fontSize: 15,
        color: '#444',
        fontWeight: '500',
    },
    recommendationContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: 'rgba(22, 49, 102, 0.05)',
        borderRadius: 8,
        padding: 12,
    },
    recommendationText: {
        fontSize: 15,
        color: '#163166',
        fontStyle: 'italic',
        fontWeight: '500',
        textAlign: 'center',
    }, overallContainer: {
        marginTop: 24,
        padding: 20,
        backgroundColor: '#163166',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    overallTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
        color: '#fff',
        textAlign: 'center',
    },
    overallText: {
        fontSize: 16,
        color: '#fff',
        lineHeight: 24,
        textAlign: 'center',
        opacity: 0.9,
    },
});
