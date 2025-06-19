/**
 * Handles API errors consistently across the application
 * @param error Error object from API call
 * @returns Error with appropriate message
 */
export const handleApiError = (error: any): Error => {
    if (error.response) {
        // Server responded with a status code outside the 2xx range
        const message = error.response.data?.message || 'Server error occurred';
        return new Error(message);
    } else if (error.request) {
        // Request was made but no response received
        return new Error('No response received from server');
    } else {
        // Something happened in setting up the request that triggered an Error
        return new Error(error.message || 'An unexpected error occurred');
    }
};
