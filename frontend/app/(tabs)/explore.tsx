import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import WeeklyAverages from '@/components/food-history/WeeklyAverages';
import WeeklyBarChart from '@/components/food-history/WeeklyBarChart';
import { getWeeklyNutrition, WeeklyNutrition } from '@/services/weeklyNutritionService';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';

export default function WeekScreen() {
  const [weeklyData, setWeeklyData] = useState<WeeklyNutrition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedDate(currentDate =>
      direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1)
    );
  };

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        setIsLoading(true);
        const data = await getWeeklyNutrition(selectedDate);
        setWeeklyData(data);
      } catch (error) {
        console.error('Error fetching weekly data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyData();
  }, [selectedDate]); const getMaxValue = (nutritionType: 'calories' | 'proteins' | 'carbs' | 'fats') => {
    if (!weeklyData) return 0;
    return Math.max(...Object.values(weeklyData.dailyData).map(day => day[nutritionType]));
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#163166" />
      </ThemedView>
    );
  }

  if (!weeklyData) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText>No data available</ThemedText>
      </ThemedView>
    );
  }

  // Get week range for display
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const dateRangeText = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  return (
    <ThemedView style={styles.container}>
      {/* Week navigation header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigateWeek('prev')} style={styles.arrowButton}>
          <ThemedText style={styles.arrowText}>←</ThemedText>
        </TouchableOpacity>
        <View style={styles.dateContainer}>
          <ThemedText style={styles.dateText}>{dateRangeText}</ThemedText>
        </View>
        <TouchableOpacity onPress={() => navigateWeek('next')} style={styles.arrowButton}>
          <ThemedText style={styles.arrowText}>→</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <WeeklyAverages averages={weeklyData.averages} />

        <WeeklyBarChart
          data={weeklyData.dailyData}
          maxValue={getMaxValue('calories')}
          nutritionType="calories"
          color="#FF6B6B"
          title="Calories"
        />

        <WeeklyBarChart
          data={weeklyData.dailyData}
          maxValue={getMaxValue('proteins')}
          nutritionType="proteins"
          color="#118AB2"
          title="Protein"
        />

        <WeeklyBarChart
          data={weeklyData.dailyData}
          maxValue={getMaxValue('carbs')}
          nutritionType="carbs"
          color="#FFD166"
          title="Carbs"
        />

        <WeeklyBarChart
          data={weeklyData.dailyData} maxValue={getMaxValue('fats')}
          nutritionType="fats"
          color="#06D6A0"
          title="Fat"
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 60, // Account for camera notch
    backgroundColor: '#fff',
    borderBottomColor: '#E1E4E8',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#163166',
  },
  arrowButton: {
    padding: 12,
    marginHorizontal: 4,
  },
  arrowText: {
    fontSize: 24,
    color: '#163166',
  },
});
