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
    },
    imageContainer: {
        width: 360,
        height: 360,
        borderRadius: 180,
        overflow: 'hidden', // Changed from 'hidden' to allow badge to be visible
        marginVertical: 16,
        position: 'relative',
        alignSelf: 'center',

    },
    foodImage: {
        width: '100%',
        height: '100%',
        borderRadius: 157, // Adjusted to match container size (165 - 8 border width)
    },
    badgeContainer: {
        position: 'absolute',
        left: 80, // Moved more to the right
        bottom: 30,
        zIndex: 10,
    },
});
