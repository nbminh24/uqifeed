import React, { useState } from 'react';
import { StyleSheet, Image, View, ActivityIndicator } from 'react-native';

interface FoodImageProps {
    imageUrl: string;
    children?: React.ReactNode;
}

export const FoodImageSimple: React.FC<FoodImageProps> = ({ imageUrl, children }) => {
    const [loading, setLoading] = useState(true);

    console.log('[FoodImageSimple] Trying to load image:', imageUrl);

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    onLoadStart={() => {
                        console.log('[FoodImageSimple] Start loading image');
                        setLoading(true);
                    }}
                    onLoad={() => {
                        console.log('[FoodImageSimple] Image loaded successfully');
                        setLoading(false);
                    }}
                    onError={(e) => {
                        console.error('[FoodImageSimple] Error loading image:', e.nativeEvent.error);
                        console.error('[FoodImageSimple] URL that failed:', imageUrl);
                        setLoading(false);
                    }}
                />
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#163166" />
                    </View>
                )}
            </View>
            {children && (
                <View style={styles.badge}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        position: 'relative',
    },
    container: {
        width: 360,
        height: 360,
        borderRadius: 180,
        overflow: 'hidden',
        marginVertical: 16,
        position: 'relative',
        alignSelf: 'center',
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        bottom: 30,
        right: 30,
    },
});
