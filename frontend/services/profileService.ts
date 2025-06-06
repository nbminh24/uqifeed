import { Profile, ProfileUpdateInput } from '@/types/profile';
import { ApiResponse } from '@/types/common';
import { API_URL } from '@/constants/Config';
import { sanitizeDate, isValidDate } from './dateUtils';
import { validateProfile } from '@/utils/validation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_TOKEN = 'default-auth-token-123';

// Add request deduplication
let currentProfileRequest: Promise<Profile> | null = null;

const parseNumericField = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    const num = Number(value);
    return !isNaN(num) ? num : null;
};

const transformProfileData = (data: any): Profile => ({
    id: data.id || '',
    userId: data.userId || '',
    gender: data.gender || 'Male',
    birthday: sanitizeDate(data.birthday),
    height: parseNumericField(data.height),
    currentWeight: parseNumericField(data.currentWeight),
    targetWeight: parseNumericField(data.targetWeight),
    target_time: sanitizeDate(data.target_time),
    activityLevel: data.activityLevel || 'Moderately active',
    goal: data.goal || 'Maintain weight',
    dietType: data.dietType || 'Balanced',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
});

const getAuthHeaders = async (): Promise<Record<string, string>> => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEFAULT_TOKEN}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    };
};

const handleResponseError = async (response: Response): Promise<never> => {
    const data = await response.json();
    if (response.status === 401 || response.status === 403) {
        // Token might be invalid, for development just log out
        console.warn('Auth error occurred, using default token');
    }
    throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
};

export const getProfile = async (): Promise<Profile> => {
    // Return existing request if one is in progress
    if (currentProfileRequest) {
        return currentProfileRequest;
    }

    try {
        currentProfileRequest = (async () => {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/api/profiles/me`, { headers });

            if (!response.ok) {
                await handleResponseError(response);
            }

            const data: ApiResponse<{ profile: any }> = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to get profile');
            }

            return transformProfileData(data.data.profile);
        })();

        const result = await currentProfileRequest;
        currentProfileRequest = null;
        return result;
    } catch (error: any) {
        currentProfileRequest = null;
        console.error('Error fetching profile:', error);
        throw new Error(error.message || 'Không thể tải thông tin. Vui lòng thử lại.');
    }
};

export const updateProfile = async (profile: ProfileUpdateInput): Promise<Profile> => {
    try {
        const errors = validateProfile(profile as Profile);
        if (Object.keys(errors).length > 0) {
            throw new Error(Object.values(errors)[0]);
        }

        // Ensure dates are valid and in ISO format
        let formattedBirthday: string;
        let formattedTargetTime: string;

        try {
            const birthday = new Date(profile.birthday);
            formattedBirthday = birthday.toISOString();

            const targetTime = new Date(profile.target_time);
            if (isNaN(targetTime.getTime())) {
                throw new Error('Invalid target date');
            }
            formattedTargetTime = targetTime.toISOString();
        } catch (error) {
            console.error('[ProfileService] Date formatting error:', error);
            throw new Error('Invalid date format');
        }

        const headers = await getAuthHeaders();
        const sanitizedProfile = {
            gender: profile.gender,
            birthday: formattedBirthday,
            height: parseNumericField(profile.height),
            currentWeight: parseNumericField(profile.currentWeight),
            targetWeight: parseNumericField(profile.targetWeight),
            target_time: formattedTargetTime,
            activityLevel: profile.activityLevel,
            goal: profile.goal,
            dietType: profile.dietType
        };

        console.log('[ProfileService] Sending update request with data:', JSON.stringify(sanitizedProfile, null, 2));

        const response = await fetch(`${API_URL}/api/profiles/me`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(sanitizedProfile)
        });

        if (!response.ok) {
            console.error('[ProfileService] Update failed with status:', response.status);
            const errorData = await response.json();
            console.error('[ProfileService] Error response:', JSON.stringify(errorData, null, 2));
            throw new Error(errorData.errors?.[0]?.message || `Error ${response.status}: ${response.statusText}`);
        }

        const data: ApiResponse<{ profile: any }> = await response.json();
        console.log('[ProfileService] Update successful. Response:', JSON.stringify(data, null, 2));

        return transformProfileData(data.data.profile);
    } catch (error: any) {
        console.error('[ProfileService] Error updating profile:', error);
        throw new Error(error.message || 'Không thể cập nhật thông tin. Vui lòng thử lại.');
    }
};
