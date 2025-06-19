// Handle different development environments
export const API_URL = __DEV__
    ? 'http://10.0.152.193:5000'  // Local development server (updated to match current IP)
    : 'https://your-production-api.com'; // Production

// Debug flag
export const DEBUG_API = __DEV__;

// Helper function to build API URLs
export const getApiUrl = (endpoint: string) => {
    const url = `${API_URL}${endpoint}`;
    if (DEBUG_API) {
        console.log('[Config] API Request URL:', url);
        console.log('[Config] Development Mode:', __DEV__);
        console.log('[Config] API Base URL:', API_URL);
    }
    return url;
};

// Helper function to check API connectivity
export const checkApiConnection = async () => {
    try {
        const response = await fetch(`${API_URL}/health`);
        const isConnected = response.ok;
        if (DEBUG_API) {
            console.log('[Config] API Connection Test:', isConnected ? 'Success' : 'Failed');
            console.log('[Config] API Response Status:', response.status);
        }
        return isConnected;
    } catch (error) {
        if (DEBUG_API) {
            console.error('[Config] API Connection Error:', error);
        }
        return false;
    }
};
