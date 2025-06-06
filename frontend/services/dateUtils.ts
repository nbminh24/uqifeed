/**
 * Format a Date object or ISO string to ISO format
 */
export const sanitizeDate = (date: string | Date | undefined | null): string => {
    try {
        console.log('[DateUtils] Sanitizing date:', date);
        if (!date) {
            console.log('[DateUtils] No date provided, using current date');
            return new Date().toISOString();
        }

        const dateObj = typeof date === 'string' ? new Date(date) : date;
        console.log('[DateUtils] Parsed date object:', dateObj);

        if (!isValidDate(dateObj)) {
            console.error('[DateUtils] Invalid date object');
            throw new Error('Invalid date');
        }

        const isoString = dateObj.toISOString();
        console.log('[DateUtils] Formatted ISO string:', isoString);
        return isoString;
    } catch (error) {
        console.error('[DateUtils] Error sanitizing date:', date, error);
        throw new Error('Invalid date format');
    }
};

/**
 * Check if a date string is valid
 */
export const isValidDate = (dateStr: string | Date): boolean => {
    try {
        const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
        return date instanceof Date && !isNaN(date.getTime());
    } catch {
        return false;
    }
};
