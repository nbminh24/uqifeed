import * as ImageManipulator from 'expo-image-manipulator';

export const processImage = async (uri: string): Promise<string> => {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }],
            {
                compress: 0.2,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );
        return result.uri;
    } catch (error) {
        console.error('[ImageProcessor] Error processing image:', error);
        throw error;
    }
};
