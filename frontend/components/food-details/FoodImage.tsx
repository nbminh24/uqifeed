import React from 'react';
import { StyleSheet, Image, View } from 'react-native';

interface FoodImageProps {
    imageUrl: string;
    children?: React.ReactNode;
}

export const FoodImage: React.FC<FoodImageProps> = ({ imageUrl, children }) => {
    console.log('Loading image from:', imageUrl);
    return (
        <View style={styles.imageWrapper}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.foodImage}
                    resizeMode="cover"
                />
            </View>
            {children && (
                <View style={styles.badgeContainer}>
                    {children}
                </View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    imageWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        position: 'relative',
    }, imageContainer: {
        width: 300,
        height: 300,
        borderRadius: 150,
        overflow: 'visible', // Changed from 'hidden' to allow badge to be visible
        marginVertical: 16,
        position: 'relative',
        alignSelf: 'center',
        borderWidth: 8,
        borderColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    }, foodImage: {
        width: '100%',
        height: '100%',
        borderRadius: 150, // Added to ensure image is still round with overflow visible
    }, badgeContainer: {
        position: 'absolute',
        left: 90, // Moved more to the right
        bottom: 25,
        zIndex: 10,
    },
});
