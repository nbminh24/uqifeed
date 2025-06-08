export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    error?: any;
}

export const isApiError = (response: any): response is ApiError => {
    return !response.success;
};
