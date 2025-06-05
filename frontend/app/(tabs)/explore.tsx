import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import WeeklyAverages from '@/components/food-history/WeeklyAverages';
import WeeklyBarChart from '@/components/food-history/WeeklyBarChart';
import { getWeeklyNutrition, WeeklyNutrition } from '@/services/weeklyNutritionService';

export default function WeekScreen() {
  const [weeklyData, setWeeklyData] = useState<WeeklyNutrition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const data = await getWeeklyNutrition(new Date());
        setWeeklyData(data);
      } catch (error) {
        console.error('Error fetching weekly data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyData();
  }, []); const getMaxValue = (nutritionType: 'calories' | 'proteins' | 'carbs' | 'fats') => {
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

  return (
    <ThemedView style={styles.container}>
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
    paddingTop: 60, // Increased padding to avoid camera notch
    backgroundColor: '#F5F6FA',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
