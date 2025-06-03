import * as FileSystem from 'expo-file-system';

export const imageCleanupService = {
    /**
     * Clean up old images that are no longer referenced in the database
     */
    cleanupOldImages: async (referencedPaths: string[]) => {
        try {
            const dirUri = `${FileSystem.documentDirectory}food_images`;
            const dirInfo = await FileSystem.getInfoAsync(dirUri);

            if (!dirInfo.exists) {
                console.log('[ImageCleanupService] No images directory found');
                return;
            }

            // Read all files in the directory
            const files = await FileSystem.readDirectoryAsync(dirUri);
            const filePaths = files.map(file => `${dirUri}/${file}`);

            // Find files that aren't referenced
            const unreferencedFiles = filePaths.filter(
                path => !referencedPaths.includes(path)
            );

            // Delete unreferenced files
            for (const file of unreferencedFiles) {
                try {
                    await FileSystem.deleteAsync(file, { idempotent: true });
                    console.log('[ImageCleanupService] Deleted:', file);
                } catch (error) {
                    console.error('[ImageCleanupService] Error deleting file:', file, error);
                }
            }

            console.log('[ImageCleanupService] Cleanup complete');
        } catch (error) {
            console.error('[ImageCleanupService] Cleanup error:', error);
        }
    }
};
