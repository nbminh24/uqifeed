import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Platform, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { format, addDays, subDays, startOfDay } from 'date-fns';
import { FoodCard } from './FoodCard';
import { WeekDayPicker } from './WeekDayPicker';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { getFoodHistory, FoodHistoryItem } from '@/services/foodHistoryService';
import { NutritionChart } from './NutritionChart';

type FoodHistoryScreenProps = {
    mascotUri?: string;
    mascotSize?: number;
};

export function FoodHistoryScreen({ mascotUri, mascotSize = 0 }: FoodHistoryScreenProps) {
    const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
    const [weekDates, setWeekDates] = useState<Date[]>([]);
    const [foodsByDate, setFoodsByDate] = useState<{ [key: string]: FoodHistoryItem[] }>({});
    const [isLoading, setIsLoading] = useState(true);

    // Add safe area padding for iOS status bar and tabs
    const statusBarHeight = 50;// Điều chỉnh khoảng cách cho status bar

    // Initialize week dates
    useEffect(() => {
        const today = startOfDay(new Date());
        const dates = [];
        // Generate dates for the last 6 days plus today, with today as the rightmost day
        for (let i = 6; i >= 0; i--) {
            dates.push(subDays(today, i));
        }
        setWeekDates(dates);
    }, []); // Remove selectedDate dependency since we want fixed week view    // Fetch food history when selected date changes
    useEffect(() => {
        const fetchFoodHistory = async () => {
            try {
                setIsLoading(true);

                // Get date string for the selected date
                const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

                // Check if we already have data for this date to avoid unnecessary fetches
                if (foodsByDate[selectedDateStr] !== undefined) {
                    console.log(`Already have data for ${selectedDateStr}, skipping fetch`);
                    setIsLoading(false);
                    return;
                }

                console.log(`Fetching data for ${selectedDateStr}`);

                // Only fetch for the selected date to optimize performance
                const response = await getFoodHistory(selectedDateStr, selectedDateStr);

                // Merge new data with existing data
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
    }, [selectedDate]); // Only re-fetch when selected date changes

    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    const foodsForSelectedDate = foodsByDate[selectedDateStr] || [];    // Format date for header
    const getFormattedDate = (date: Date) => {
        const today = startOfDay(new Date());
        const yesterday = subDays(today, 1);

        if (date.getTime() === today.getTime()) {
            return `Today, ${format(date, 'dd/MM/yy')}`;
        } else if (date.getTime() === yesterday.getTime()) {
            return `Yesterday, ${format(date, 'dd/MM/yy')}`;
        } else {
            return format(date, 'EEEE, dd/MM/yy');
        }
    }; return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={[]}>
                <ThemedView style={styles.container} lightColor="#FFFFFF">
                    {isLoading ? (
                        <ActivityIndicator style={styles.loader} size="large" color="#163166" />
                    ) : (
                        <FlatList
                            data={foodsForSelectedDate} ListHeaderComponent={() => (
                                <>                                    {/* Mascot GIF with frame */}
                                    {mascotUri && (
                                        <View style={styles.mascotContainer}>
                                            <View style={styles.mascotFrame}>
                                                <View style={{
                                                    overflow: 'hidden',
                                                    height: mascotSize ? mascotSize - 120 : 250, // Adjusted height
                                                }}>
                                                    <Image
                                                        source={{ uri: mascotUri }}
                                                        style={{
                                                            width: mascotSize || 300,
                                                            height: mascotSize || 300,
                                                        }}
                                                        resizeMode="contain"
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    <View style={styles.header}>
                                        <ThemedText style={styles.headerTitle}>
                                            {getFormattedDate(selectedDate)}
                                        </ThemedText>
                                    </View>                                    <WeekDayPicker
                                        selectedDate={selectedDate}
                                        onSelectDate={setSelectedDate}
                                        dates={weekDates}
                                    />                                    {foodsForSelectedDate.length > 0 && (
                                        <NutritionChart
                                            calories={foodsForSelectedDate.reduce((total, item) => total + item.calories, 0)}
                                            carbs={foodsForSelectedDate.reduce((total, item) => total + (item.carbs || 0), 0)}
                                            proteins={foodsForSelectedDate.reduce((total, item) => total + (item.proteins || 0), 0)}
                                            fats={foodsForSelectedDate.reduce((total, item) => total + (item.fats || 0), 0)}
                                        />
                                    )}
                                </>
                            )}
                            ListEmptyComponent={() => (
                                <ThemedView style={styles.emptyState}>
                                    <ThemedText style={styles.emptyText}>
                                        No meals recorded for this day
                                    </ThemedText>
                                </ThemedView>
                            )}
                            renderItem={({ item }) => (
                                <FoodCard
                                    id={item.id}
                                    name={item.name}
                                    mealTime={item.mealTime}
                                    calories={item.calories}
                                    imageUrl={item.imageUrl}
                                />
                            )} keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </ThemedView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 0, // Ensure no extra padding at the top
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: '700',
        color: '#163166',
        textAlign: 'center',
        letterSpacing: 0.35,
    }, listContent: {
        paddingBottom: 100, // Extra padding at the bottom
        paddingHorizontal: 16,
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
        paddingHorizontal: 24,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        opacity: 0.7,
        lineHeight: 24,
    },    // Mascot styles
    mascotContainer: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingTop: 20, // Add some space at the top
    },
    mascotFrame: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
    },
    mascotWrapper: {
        overflow: 'hidden',
    },
    mascot: {
        // Width and height will be set dynamically
    },
});
