import { API_URL } from '../constants/Config';
import { weeklyReportService, WeeklyReport } from './weeklyReportService';

export interface WeeklyBMIData {
    id: string;
    userId: string;
    weekStart: string;
    weight: number;
    height: number;
    bmi: number;
    category: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface WeeklyBMIResponse {
    success: boolean;
    data: WeeklyBMIData | null;
    message: string;
}

// Convert WeeklyBMIData to WeeklyReport format
const convertToWeeklyReport = (bmiData: WeeklyBMIData): Partial<WeeklyReport> => {
    return {
        userId: bmiData.userId,
        weekStart: bmiData.weekStart,
        weight: bmiData.weight,
        height: bmiData.height,
        bmi: bmiData.bmi
    };
};

export interface WeeklyBMIHistoryResponse {
    success: boolean;
    data: WeeklyBMIData[];
    message: string;
}

/**
 * Update weekly BMI
 * @param weight Weight in kilograms
 * @param height Height in meters
 * @param weekStart Optional week start date in YYYY-MM-DD format
 * @returns Weekly BMI data
 */
export const updateWeeklyBMI = async (weight: number, height: number, weekStart?: string): Promise<WeeklyBMIData | null> => {
    try {
        // Update BMI data
        const response = await fetch(`${API_URL}/api/weekly-bmi`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer mock_token_for_development'
            },
            body: JSON.stringify({ weight, height, weekStart })
        });

        if (!response.ok) {
            throw new Error('Failed to update weekly BMI');
        } const data: WeeklyBMIResponse = await response.json();

        // Also update weekly report in parallel
        if (data.success && data.data) {
            weeklyReportService.createOrUpdate(convertToWeeklyReport(data.data))
                .catch(error => console.error('Error updating weekly report:', error));
        }

        return data.success ? data.data : null;
    } catch (error) {
        console.error('Error updating weekly BMI:', error);
        return null;
    }
};

/**
 * Get current week's BMI
 * @returns Weekly BMI data
 */
export const getCurrentWeekBMI = async (): Promise<WeeklyBMIData | null> => {
    try {
        const response = await fetch(`${API_URL}/api/weekly-bmi/current`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer mock_token_for_development'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get current week BMI');
        }

        const data: WeeklyBMIResponse = await response.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error('Error getting current week BMI:', error);
        return null;
    }
};

/**
 * Get BMI history
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @returns Array of weekly BMI data
 */
export const getBMIHistory = async (startDate: string, endDate: string): Promise<WeeklyBMIData[]> => {
    try {
        const params = new URLSearchParams({
            startDate,
            endDate
        });

        const response = await fetch(
            `${API_URL}/api/weekly-bmi/history?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer mock_token_for_development'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to get BMI history');
        }

        const data: WeeklyBMIHistoryResponse = await response.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error('Error getting BMI history:', error);
        return [];
    }
};
