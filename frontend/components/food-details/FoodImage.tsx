import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, ActivityIndicator } from 'react-native';
import { ThemedText } from '../ThemedText';

interface FoodImageProps {
    imageUrl: string;
    children?: React.ReactNode;
}

export const FoodImage: React.FC<FoodImageProps> = ({ imageUrl, children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false); useEffect(() => {
        if (!imageUrl) {
            console.error('[FoodImage] No image URL provided');
            setError(true);
            setLoading(false);
            return;
        }

        setError(false);
        // Initial loading state will be handled by onLoadStart
    }, [imageUrl]); console.log('[FoodImage] Current state:', { loading, error });

    return (
        <View style={styles.imageWrapper}>
            <View style={styles.imageContainer}>
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#163166" />
                    </View>
                )}                <Image source={{
                    uri: imageUrl.replace('/static/text-mock.jpg', 'https://i.pinimg.com/736x/4b/df/13/4bdf13a13c23d9d873a9ed306ad5a6fa.jpg'),
                    cache: 'reload'
                }}
                    style={[styles.image, loading && { opacity: 0.7 }]}
                    resizeMode="cover"
                    fadeDuration={200}
                    onLoadStart={() => {
                        console.log('[FoodImage] Loading URL:', imageUrl);
                        setLoading(true);
                    }}
                    onLoad={() => {
                        console.log('[FoodImage] Successfully loaded image');
                        setLoading(false);
                        setError(false);
                    }}
                    onError={(e) => {
                        console.error('[FoodImage] Error loading image:', e.nativeEvent.error);
                        setLoading(false);
                        setError(true);
                    }}
                />
                {error && (
                    <View style={styles.errorContainer}>
                        <ThemedText style={styles.errorText}>Could not load image</ThemedText>
                    </View>
                )}
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
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        position: 'relative',
    }, imageContainer: {
        width: 360,
        height: 360,
        borderRadius: 16,
        overflow: 'hidden',
        marginVertical: 16,
        position: 'relative',
        alignSelf: 'center',
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    }, overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    }, loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    errorText: {
        fontSize: 16,
        color: '#FF6B6B',
        textAlign: 'center',
    },
    badgeContainer: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        zIndex: 2,
    },
});
