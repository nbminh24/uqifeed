import React from 'react';
import { StyleSheet, Image, View } from 'react-native';

interface FoodImageProps {
    imageUrl: string;
}

export const FoodImage: React.FC<FoodImageProps> = ({ imageUrl }) => {
    return (
        <View style={styles.imageWrapper}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.foodImage}
                    resizeMode="cover"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    imageWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        width: 300,
        height: 300,
        borderRadius: 150,
        overflow: 'hidden',
        marginVertical: 16,
        position: 'relative',
        alignSelf: 'center',
    },
    foodImage: {
        width: '100%',
        height: '100%',
    },
});
