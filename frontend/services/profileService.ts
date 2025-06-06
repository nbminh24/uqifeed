import { Profile, ProfileUpdateInput } from '@/types/profile';
import { API_URL } from '@/constants/Config';
import { sanitizeDate } from './dateUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const parseNumericField = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    const num = Number(value);
    return !isNaN(num) ? num : null;
};

const transformProfileData = (data: any): Profile => {
    return {
        id: data.id || '',
        userId: data.userId || '',
        gender: data.gender || 'Male',
        birthday: sanitizeDate(data.birthday) || new Date().toISOString(),
        height: parseNumericField(data.height),
        currentWeight: parseNumericField(data.currentWeight),
        targetWeight: parseNumericField(data.targetWeight),
        target_time: sanitizeDate(data.target_time) || new Date().toISOString(),
        activityLevel: data.activityLevel || 'Moderately active',
        goal: data.goal || 'Maintain weight',
        dietType: data.dietType || 'Balanced',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    };
};

export const getProfile = async (): Promise<Profile> => {
    try {
        // Lấy token xác thực
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.warn('No token found, proceeding without authentication');
        }

        const headers: Record<string, string> = {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/api/profiles/me`, {
            headers,
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized - Invalid token');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to get profile');
        }

        return transformProfileData(data.data.profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const updateProfile = async (profile: ProfileUpdateInput): Promise<Profile> => {
    try {
        // Lấy token xác thực
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.warn('No token found, proceeding without authentication');
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Sanitize dates and numeric values before sending to server
        const sanitizedProfile = {
            ...profile,
            birthday: profile.birthday ? sanitizeDate(profile.birthday) : undefined,
            target_time: profile.target_time ? sanitizeDate(profile.target_time) : undefined,
            height: profile.height !== undefined ? parseNumericField(profile.height) : undefined,
            currentWeight: profile.currentWeight !== undefined ? parseNumericField(profile.currentWeight) : undefined,
            targetWeight: profile.targetWeight !== undefined ? parseNumericField(profile.targetWeight) : undefined,
        };

        const response = await fetch(`${API_URL}/api/profiles/me`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(sanitizedProfile),
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to update profile');
        }

        return transformProfileData(data.data.profile);
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};
