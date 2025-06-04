import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface FloatingActionButtonProps {
    iconName: React.ComponentProps<typeof MaterialIcons>['name'];
    onPress: () => void;
    style?: ViewStyle;
    size?: number;
}

export function FloatingActionButton({ iconName,
    onPress,
    style,
    size = 28,
}: FloatingActionButtonProps) {
    const backgroundColor = useThemeColor(
        {
            light: '#1E2A3A', // Màu xanh đen cho nền
            dark: '#1E2A3A', // Giữ màu xanh đen cho nền
        },
        'background'
    );

    const iconColor = useThemeColor(
        {
            light: '#FFFFFF', // Icon màu trắng
            dark: '#FFFFFF', // Giữ icon màu trắng
        },
        'text'
    );

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <MaterialIcons name={iconName} size={size} color={iconColor} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 70,
        height: 70,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
});
