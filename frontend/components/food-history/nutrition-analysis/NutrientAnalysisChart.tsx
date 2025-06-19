import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../../ThemedText';

interface NutrientAnalysisChartProps {
    nutrientType: 'Calories' | 'Protein' | 'Carbs' | 'Fats';
    current: number;
    target: number;
    previousValue?: number;
    unit: string;
}

export const NutrientAnalysisChart: React.FC<NutrientAnalysisChartProps> = ({
    nutrientType,
    current,
    target,
    previousValue,
    unit
}) => {
    const progress = calculateProgress(current, target);
    const trend = getTrend(current, previousValue);

    return (
        <View style={styles.container}>
            {/* Weekly Bar Chart section - this is already rendered in the parent component */}

            {/* Analysis Section */}
            <View style={styles.analysisCard}>
                <ThemedText style={styles.analysisTitle}>
                    {nutrientType} Analysis
                </ThemedText>

                <View style={styles.metricsContainer}>
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
                        <ThemedText style={[
                            styles.metricValue,
                            { color: getProgressColor(progress) }
                        ]}>
                            {progress}%
                        </ThemedText>
                    </View>
                </View>

                {previousValue && (
                    <View style={styles.trendSection}>
                        <ThemedText style={styles.trendTitle}>Weekly Trend</ThemedText>
                        <ThemedText style={styles.trendText}>
                            {trend === 'stable'
                                ? 'Your intake has remained stable'
                                : trend === 'increasing'
                                    ? `Increased by ${(current - previousValue).toFixed(1)}${unit}`
                                    : `Decreased by ${(previousValue - current).toFixed(1)}${unit}`
                            }
                        </ThemedText>
                    </View>
                )}

                <View style={styles.recommendationSection}>
                    <ThemedText style={styles.recommendationTitle}>
                        Recommendations
                    </ThemedText>
                    <ThemedText style={styles.recommendationText}>
                        {getRecommendation(nutrientType, progress)}
                    </ThemedText>
                </View>
            </View>
        </View>
    );
};

const calculateProgress = (current: number, target: number) => {
    return Math.round((current / target) * 100);
};

const getTrend = (current: number, previous?: number) => {
    if (!previous) return 'N/A';
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
    container: {
        marginBottom: 24,
    },
    analysisCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginTop: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    analysisTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#163166',
        marginBottom: 16,
    },
    metricsContainer: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
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
    trendSection: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    trendTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#163166',
        marginBottom: 8,
    },
    trendText: {
        fontSize: 14,
        color: '#666',
    },
    recommendationSection: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
    },
    recommendationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#163166',
        marginBottom: 8,
    },
    recommendationText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});
