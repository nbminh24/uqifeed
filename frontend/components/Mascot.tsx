import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';

export function Mascot() {
    const primaryColor = useThemeColor({}, 'primary');

    const navigateToChatbot = () => {
        router.push('/chatbot');
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={navigateToChatbot}
        >
            <Ionicons
                name="nutrition-outline"
                size={32}
                color={primaryColor}
                style={styles.icon}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    icon: {
        marginBottom: -2, // Small adjustment for visual centering
    },
});
