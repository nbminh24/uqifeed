// Handle different development environments
export const API_URL = __DEV__
    ? 'http://10.0.136.13:5000'  // Local development server (updated to match current IP)
    : 'https://your-production-api.com'; // Production

// Helper function to build API URLs
export const getApiUrl = (endpoint: string) => {
    const url = `${API_URL}${endpoint}`;
    console.log('[Config] API Request URL:', url);
    return url;
};
