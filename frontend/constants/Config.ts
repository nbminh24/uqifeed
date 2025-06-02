// You can change this to your computer's IP address when testing on real device
export const API_URL = __DEV__
    ? 'http://10.0.0.233:5000'  // Development - your computer's IP
    : 'https://your-production-api.com'; // Production

export const getApiUrl = (endpoint: string) => `${API_URL}${endpoint}`;
