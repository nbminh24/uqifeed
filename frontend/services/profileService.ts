import { Profile } from '@/types/profile';
import { API_URL } from '@/constants/Config';
import { sanitizeDate } from './dateUtils';

export const getProfile = async (): Promise<Profile> => {
    try {
        const response = await fetch(`${API_URL}/api/profiles/me`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to get profile');
        }

        // Ensure birthday and target_time are valid dates
        const profile = data.data.profile;
        if (profile) {
            profile.birthday = sanitizeDate(profile.birthday);
            profile.target_time = sanitizeDate(profile.target_time);
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const updateProfile = async (profile: Partial<Profile>): Promise<Profile> => {
    try {
        // Sanitize dates before sending to server
        const sanitizedProfile = {
            ...profile,
            birthday: profile.birthday ? sanitizeDate(profile.birthday) : undefined,
            target_time: profile.target_time ? sanitizeDate(profile.target_time) : undefined,
        };

        const response = await fetch(`${API_URL}/api/profiles/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanitizedProfile),
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to update profile');
        }

        return data.data.profile;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};
