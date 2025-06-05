import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { format, addDays, subDays, startOfDay } from 'date-fns';
import { FoodCard } from '@/components/food-history/FoodCard';
import { WeekDayPicker } from '@/components/food-history/WeekDayPicker';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { getFoodHistory, FoodHistoryItem } from '@/services/foodHistoryService';

export default function FoodHistoryScreen() {
    const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
    const [weekDates, setWeekDates] = useState<Date[]>([]);
    const [foodsByDate, setFoodsByDate] = useState<{ [key: string]: FoodHistoryItem[] }>({});
    const [isLoading, setIsLoading] = useState(true);

    // Initialize week dates
    useEffect(() => {
        const dates = [];
        for (let i = -3; i <= 3; i++) {
            dates.push(addDays(selectedDate, i));
        }
        setWeekDates(dates);
    }, [selectedDate]);    // Fetch food history when selected date changes
    useEffect(() => {
        const fetchFoodHistory = async () => {
            try {
                setIsLoading(true);

                // Only fetch data for the current selected date
                const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

                // Optimize by only fetching for the single selected date
                const response = await getFoodHistory(selectedDateStr, selectedDateStr);

                setFoodsByDate(prev => ({
                    ...prev,
                    ...response
                }));
            } catch (error) {
                console.error('Error fetching food history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFoodHistory();
    }, [selectedDate]);

    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    const foodsForSelectedDate = foodsByDate[selectedDateStr] || [];

    return (
        <ThemedView style={styles.container}>
            <WeekDayPicker
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                dates={weekDates}
            />

            {isLoading ? (
                <ActivityIndicator style={styles.loader} size="large" />
            ) : foodsForSelectedDate.length > 0 ? (
                <FlatList
                    data={foodsForSelectedDate}
                    renderItem={({ item }) => (<FoodCard
                        id={item.id}
                        name={item.name}
                        mealTime={item.mealTime}
                        calories={item.calories}
                        imageUrl={item.imageUrl}
                    />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <ThemedView style={styles.emptyState}>
                    <ThemedText style={styles.emptyText}>
                        No meals recorded for this day
                    </ThemedText>
                </ThemedView>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingVertical: 8,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
});
