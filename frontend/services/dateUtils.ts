export const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

export const sanitizeDate = (dateString: string | undefined | null): string => {
    if (!dateString || !isValidDate(dateString)) {
        return new Date().toISOString();
    }
    return new Date(dateString).toISOString();
};
