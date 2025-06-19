import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import WeeklyAverages from '@/components/food-history/WeeklyAverages';
import WeeklyBarChart from '@/components/food-history/WeeklyBarChart';
import { WeeklyBMICard } from '@/components/food-history/WeeklyBMICard';
import { UpdateBMIModal } from '@/components/food-history/UpdateBMIModal';
import { WeeklyNutritionAnalysis } from '@/components/food-history/WeeklyNutritionAnalysis';
import { getWeeklyNutrition, WeeklyNutrition } from '@/services/weeklyNutritionService';
import { WeeklyBMIData, getCurrentWeekBMI, updateWeeklyBMI, getBMIHistory } from '@/services/weeklyBMIService';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';

export default function WeekScreen() {
  const [weeklyData, setWeeklyData] = useState<WeeklyNutrition | null>(null);
  const [previousWeekData, setPreviousWeekData] = useState<WeeklyNutrition | null>(null);
  const [bmiData, setBmiData] = useState<WeeklyBMIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isUpdateBMIModalVisible, setIsUpdateBMIModalVisible] = useState(false);

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedDate(currentDate =>
      direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1)
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start on Monday
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        const previousWeekStart = subWeeks(weekStart, 1);
        const formattedWeekStart = format(weekStart, 'yyyy-MM-dd');
        const formattedWeekEnd = format(weekEnd, 'yyyy-MM-dd');

        const [weeklyNutritionData, previousWeekNutritionData, weekBMI] = await Promise.all([
          getWeeklyNutrition(selectedDate),
          getWeeklyNutrition(previousWeekStart),
          getBMIHistory(formattedWeekStart, formattedWeekEnd)
        ]); setWeeklyData(weeklyNutritionData);
        setPreviousWeekData(previousWeekNutritionData);
        // Use first BMI record for the week if available
        setBmiData(weekBMI && weekBMI.length > 0 ? weekBMI[0] : null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]); const handleUpdateBMI = async (weight: number, height: number, selectedDate: string) => {
    try {
      setIsLoading(true);
      const updatedBMI = await updateWeeklyBMI(weight, height, selectedDate);
      if (updatedBMI) {
        setBmiData(updatedBMI);
      }
    } catch (error) {
      console.error('Error updating BMI:', error);
    } finally {
      setIsLoading(false);
      // Refresh data after update
      const weekStart = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(selectedDate), { weekStartsOn: 1 });
      const formattedWeekStart = format(weekStart, 'yyyy-MM-dd');
      const formattedWeekEnd = format(weekEnd, 'yyyy-MM-dd');
      getBMIHistory(formattedWeekStart, formattedWeekEnd)
        .then(bmiHistory => {
          if (bmiHistory && bmiHistory.length > 0) {
            setBmiData(bmiHistory[0]);
          }
        })
        .catch(error => console.error('Error refreshing BMI data:', error));
    }
  };

  const getMaxValue = (nutritionType: 'calories' | 'proteins' | 'carbs' | 'fats') => {
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

      <ScrollView showsVerticalScrollIndicator={false}>        <WeeklyBMICard
        bmiData={bmiData}
        onUpdatePress={() => setIsUpdateBMIModalVisible(true)}
      />

        <UpdateBMIModal
          visible={isUpdateBMIModalVisible}
          onClose={() => setIsUpdateBMIModalVisible(false)}
          onSubmit={handleUpdateBMI}
          currentWeight={bmiData?.weight}
          currentHeight={bmiData?.height}
          defaultDate={format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd')}
        />        <WeeklyNutritionAnalysis
          weeklyData={weeklyData}
          previousWeekData={previousWeekData}
        />

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
          data={weeklyData.dailyData}
          maxValue={getMaxValue('fats')}
          nutritionType="fats"
          color="#06D6A0"
          title="Fat"
        />
      </ScrollView>

      <UpdateBMIModal
        visible={isUpdateBMIModalVisible}
        onClose={() => setIsUpdateBMIModalVisible(false)}
        onSubmit={handleUpdateBMI}
        currentWeight={bmiData?.weight}
        currentHeight={bmiData?.height}
      />
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
