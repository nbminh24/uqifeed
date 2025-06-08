import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { getFoodHistory } from './foodHistoryService';

export interface DailyNutrition {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
}

export interface WeeklyNutrition {
    averages: DailyNutrition;
    dailyData: {
        [date: string]: DailyNutrition;
    };
}

export const getWeeklyNutrition = async (date: Date): Promise<WeeklyNutrition> => {
    // Get Monday and Sunday of the week containing the given date
    const start = startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });

    // Get all dates in the week
    const datesInWeek = eachDayOfInterval({ start, end });

    // Format dates for API call
    const startDate = format(start, 'yyyy-MM-dd');
    const endDate = format(end, 'yyyy-MM-dd');

    // Get food history for the week
    const foodHistory = await getFoodHistory(startDate, endDate);

    // Initialize weekly data structure
    const weeklyData: WeeklyNutrition = {
        averages: {
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
        },
        dailyData: {},
    };

    // Initialize daily data for each day of the week
    datesInWeek.forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        weeklyData.dailyData[dateStr] = {
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
        };
    });

    // Calculate daily totals
    Object.entries(foodHistory).forEach(([date, foods]) => {
        const dailyTotals = foods.reduce(
            (totals, food) => {
                return {
                    calories: totals.calories + (food.calories || 0),
                    proteins: totals.proteins + (food.proteins || 0),
                    carbs: totals.carbs + (food.carbs || 0),
                    fats: totals.fats + (food.fats || 0),
                };
            },
            { calories: 0, proteins: 0, carbs: 0, fats: 0 }
        );
        weeklyData.dailyData[date] = dailyTotals;
    });

    // Calculate averages
    const numberOfDays = datesInWeek.length;
    const totals = Object.values(weeklyData.dailyData).reduce(
        (sum, day) => ({
            calories: sum.calories + day.calories,
            proteins: sum.proteins + day.proteins,
            carbs: sum.carbs + day.carbs,
            fats: sum.fats + day.fats,
        }),
        { calories: 0, proteins: 0, carbs: 0, fats: 0 }
    );

    weeklyData.averages = {
        calories: Math.round(totals.calories / numberOfDays),
        proteins: Math.round(totals.proteins / numberOfDays),
        carbs: Math.round(totals.carbs / numberOfDays),
        fats: Math.round(totals.fats / numberOfDays),
    };

    return weeklyData;
};
