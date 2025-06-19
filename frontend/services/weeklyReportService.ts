import { API_URL } from '../constants/Config';
import { handleApiError } from '../utils/error';

export interface WeeklyReport {
    userId: string;
    weekStart: string;
    weekEnd: string;
    bmi?: number;
    height?: number;
    weight?: number;
    avgNutrition?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
    };
    analysis?: {
        summary: string;
        recommendations: string[];
        trends: string[];
    };
    score?: number;
}

export const weeklyReportService = {
    /**
     * Create or update weekly report
     */
    async createOrUpdate(data: Partial<WeeklyReport>): Promise<WeeklyReport> {
        try {
            const response = await fetch(`${API_URL}/api/weekly-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get weekly reports by date range
     */
    async getByDateRange(startDate: string, endDate: string): Promise<WeeklyReport[]> {
        try {
            const response = await fetch(
                `${API_URL}/api/weekly-report/range?startDate=${startDate}&endDate=${endDate}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get most recent weekly report
     */
    async getMostRecent(): Promise<WeeklyReport | null> {
        try {
            const response = await fetch(`${API_URL}/api/weekly-report/recent`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
