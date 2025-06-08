import React from 'react';
import { StyleSheet, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

interface NutritionChartProps {
    calories: number;
    carbs: number;
    fats: number;
    proteins: number;
    maxCalories?: number;
}

export function NutritionChart({
    calories,
    carbs,
    fats,
    proteins,
    maxCalories = 2000 // Default daily calorie target
}: NutritionChartProps) {
    const roundToOneDecimal = (value: number) => Math.round(value * 10) / 10;

    // Calculate values
    const progressValue = Math.round((calories / maxCalories) * 100);
    const carbsWidth = Math.round((carbs / 150) * 100);
    const fatsWidth = Math.round((fats / 80) * 100);
    const proteinsWidth = Math.round((proteins / 80) * 100);

    const getProgressColor = (percentage: number) => {
        return percentage > 100 ? '#FF0000' : '#1E2A3A';
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.circularChartContainer}>
                    <CircularProgress
                        value={progressValue}
                        radius={50}
                        duration={2000}
                        progressValueColor={'#000'}
                        maxValue={100}
                        title={''}
                        progressValueStyle={{ fontSize: 24, fontWeight: '700' }}
                        activeStrokeWidth={10}
                        inActiveStrokeWidth={10}
                        valueSuffix={'%'}
                        activeStrokeColor={getProgressColor(progressValue)}
                    />
                    <ThemedText style={styles.calorieText}>
                        {Math.round(calories)} / {Math.round(maxCalories)} kcal
                    </ThemedText>
                </View>

                <View style={styles.nutrientsContainer}>
                    <View style={styles.nutrientItem}>
                        <View style={styles.nutrientHeader}>
                            <ThemedText style={styles.nutrientLabel}>Carbs</ThemedText>
                            <ThemedText style={styles.nutrientValue}>{roundToOneDecimal(carbs)}g</ThemedText>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[
                                styles.progressBar,
                                {
                                    width: `${carbsWidth}%`,
                                    backgroundColor: getProgressColor(carbsWidth)
                                }
                            ]} />
                        </View>
                    </View>

                    <View style={styles.nutrientItem}>
                        <View style={styles.nutrientHeader}>
                            <ThemedText style={styles.nutrientLabel}>Fats</ThemedText>
                            <ThemedText style={styles.nutrientValue}>{roundToOneDecimal(fats)}g</ThemedText>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[
                                styles.progressBar,
                                {
                                    width: `${fatsWidth}%`,
                                    backgroundColor: getProgressColor(fatsWidth)
                                }
                            ]} />
                        </View>
                    </View>

                    <View style={styles.nutrientItem}>
                        <View style={styles.nutrientHeader}>
                            <ThemedText style={styles.nutrientLabel}>Proteins</ThemedText>
                            <ThemedText style={styles.nutrientValue}>{roundToOneDecimal(proteins)}g</ThemedText>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[
                                styles.progressBar,
                                {
                                    width: `${proteinsWidth}%`,
                                    backgroundColor: getProgressColor(proteinsWidth)
                                }
                            ]} />
                        </View>
                    </View>
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }, contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }, circularChartContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginLeft: -20,
    },
    nutrientsContainer: {
        flex: 3,
        gap: 12,
    },
    nutrientItem: {
        marginBottom: 4,
    },
    nutrientHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    nutrientLabel: {
        fontSize: 14,
        color: '#8E8E8E',
    },
    nutrientValue: {
        fontSize: 14,
        fontWeight: '600',
    }, progressBarContainer: {
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
    },
    progressBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        borderRadius: 4,
    },
    calorieText: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: '500',
        color: '#666',
        textAlign: 'center',
    },
});
