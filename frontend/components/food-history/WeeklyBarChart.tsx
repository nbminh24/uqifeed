import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Animated, Platform, ViewStyle, TextStyle } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface WeeklyBarChartProps {
    data: {
        [date: string]: {
            calories: number;
            proteins: number;
            carbs: number;
            fats: number;
        };
    };
    maxValue: number;
    nutritionType: 'calories' | 'proteins' | 'carbs' | 'fats';
    color: string;
    title: string;
}

const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({
    data,
    maxValue,
    nutritionType,
    color,
    title
}) => {
    // Animation values for bar height and opacity
    const barAnimation = React.useRef(new Animated.Value(0)).current;
    const opacityAnimation = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Reset animations when data changes
        barAnimation.setValue(0);
        opacityAnimation.setValue(0);

        // Run parallel animations
        Animated.parallel([
            Animated.timing(barAnimation, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false,
            }),
            Animated.timing(opacityAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
            }),
        ]).start();
    }, [data]);

    const dates = Object.keys(data).sort();

    const getBarHeight = (value: number) => {
        if (maxValue === 0) return 0;
        return barAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, (value / maxValue) * 150],
        });
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <View style={styles.chartContainer}>
                {dates.map((date) => {
                    const value = data[date][nutritionType];
                    const height = getBarHeight(value);

                    return (
                        <View key={date} style={styles.barContainer}>
                            <View style={[styles.barLabelContainer, { opacity: value > 0 ? 1 : 0.5 }]}>
                                <ThemedText style={styles.barValue}>
                                    {nutritionType === 'calories' ? Math.round(value) : Math.round(value) + 'g'}
                                </ThemedText>
                            </View>
                            <View style={styles.bar}>
                                <Animated.View
                                    style={[
                                        styles.barFill,
                                        {
                                            height,
                                            backgroundColor: color,
                                            opacity: opacityAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, value > 0 ? 1 : 0.3],
                                            }),
                                        },
                                    ]}
                                />
                            </View>
                            <ThemedText style={styles.dateLabel}>
                                {format(new Date(date), 'EEE', { locale: vi })}
                            </ThemedText>
                        </View>
                    );
                })}
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 8,
        padding: 16,
        borderRadius: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    title: {
        fontSize: 16,
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
        fontWeight: '600',
        margin: 8,
        color: '#333',
        textAlign: 'center',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flex: 1,
        padding: 16,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 200,
    },
    barLabelContainer: {
        margin: 4,
        minHeight: 20,
        alignItems: 'center',
    },
    barValue: {
        fontSize: 12,
        color: '#666',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    bar: {
        minWidth: 20,
        minHeight: 150,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    barFill: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: 10,
    },
    dateLabel: {
        fontSize: 12,
        color: '#666',
        margin: 4,
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
        textTransform: 'capitalize',
    },
});

export default WeeklyBarChart;
