// Helper function to safely convert meal type ID to number
export const safeParseMealTypeId = (id: string | number): number => {
    if (typeof id === 'number') return id;

    const parsed = Number(id);
    if (isNaN(parsed)) {
        console.warn(`Invalid meal type ID: ${id}, defaulting to 1 (breakfast)`);
        return 1; // Default to breakfast
    }

    return parsed;
};
