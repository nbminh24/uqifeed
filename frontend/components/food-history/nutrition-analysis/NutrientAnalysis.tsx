import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../../ThemedText';

interface NutrientAnalysisProps {
    nutrientType: string;
    current: number;
    target: number;
    previousValue?: number;
    unit: string;
}

export const NutrientAnalysis: React.FC<NutrientAnalysisProps> = ({
    nutrientType,
    current,
    target,
    previousValue,
    unit
}) => {
    const progress = calculateProgress(current, target);
    const trend = previousValue ? getTrend(current, previousValue) : null;

    return (
        <View style={styles.analysisContainer}>
            <View style={styles.metricsSection}>
                <View style={styles.metricRow}>
                    <ThemedText style={styles.metricLabel}>Current:</ThemedText>
                    <ThemedText style={styles.metricValue}>{current.toFixed(1)}{unit}</ThemedText>
                </View>
                <View style={styles.metricRow}>
                    <ThemedText style={styles.metricLabel}>Target:</ThemedText>
                    <ThemedText style={styles.metricValue}>{target}{unit}</ThemedText>
                </View>
                <View style={styles.metricRow}>
                    <ThemedText style={styles.metricLabel}>Progress:</ThemedText>
                    <ThemedText style={[styles.progressValue, { color: getProgressColor(progress) }]}>
                        {progress}%
                    </ThemedText>
                </View>
            </View>

            {trend && (
                <View style={styles.trendSection}>
                    <ThemedText style={styles.sectionTitle}>Weekly Trend</ThemedText>
                    <ThemedText style={styles.trendText}>
                        {trend === 'stable'
                            ? 'Your intake has remained stable'
                            : `${trend === 'increasing' ? 'Increased' : 'Decreased'} by ${Math.abs(current - previousValue!).toFixed(1)}${unit}`
                        }
                    </ThemedText>
                </View>
            )}

            <View style={styles.recommendationSection}>
                <ThemedText style={styles.sectionTitle}>
                    Recommendations
                </ThemedText>
                <ThemedText style={styles.recommendationText}>
                    {getRecommendation(nutrientType, progress)}
                </ThemedText>
            </View>
        </View>
    );
};

const calculateProgress = (current: number, target: number) => {
    return Math.round((current / target) * 100);
};

const getTrend = (current: number, previous: number) => {
    const diff = current - previous;
    if (Math.abs(diff) < 0.1) return 'stable';
    return diff > 0 ? 'increasing' : 'decreasing';
};

const getProgressColor = (percentage: number) => {
    if (percentage >= 90 && percentage <= 110) return '#4CAF50';
    if (percentage < 70 || percentage > 130) return '#F44336';
    return '#FF9800';
};

const getRecommendation = (nutrientType: string, progress: number) => {
    if (progress >= 90 && progress <= 110) {
        return `✓ Great job! Your ${nutrientType.toLowerCase()} intake is within the recommended range.`;
    }

    if (progress < 90) {
        switch (nutrientType) {
            case 'Calories':
                return '! Consider increasing your portions or adding healthy snacks between meals.';
            case 'Protein':
                return '! Try incorporating more lean meats, fish, eggs, or plant-based proteins.';
            case 'Carbs':
                return '! Add more whole grains, fruits, and starchy vegetables to your meals.';
            case 'Fats':
                return '! Include healthy fats like avocados, nuts, and olive oil in your diet.';
            default:
                return `! Try to increase your ${nutrientType.toLowerCase()} intake.`;
        }
    }

    switch (nutrientType) {
        case 'Calories':
            return '! Focus on portion control and choosing nutrient-dense, lower-calorie foods.';
        case 'Protein':
            return '! While protein is important, consider balancing it with other nutrients.';
        case 'Carbs':
            return '! Try replacing some refined carbs with vegetables and fiber-rich alternatives.';
        case 'Fats':
            return '! Consider reducing portion sizes of high-fat foods and choosing leaner options.';
        default:
            return `! Consider reducing your ${nutrientType.toLowerCase()} intake.`;
    }
};

const styles = StyleSheet.create({
    analysisContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginTop: 8,
    },
    metricsSection: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    metricLabel: {
        fontSize: 14,
        color: '#666',
    },
    metricValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#163166',
    },
    progressValue: {
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    trendSection: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    recommendationSection: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#163166',
        marginBottom: 8,
    },
    trendText: {
        fontSize: 14,
        color: '#666',
    },
    recommendationText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});
