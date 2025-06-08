import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    type?: 'primary' | 'secondary';
}

export function Button({ title, type = 'primary', style, ...otherProps }: ButtonProps) {
    const backgroundColor = useThemeColor(
        {
            light: type === 'primary' ? '#163166' : '#E0E0E0',
            dark: type === 'primary' ? '#163166' : '#303030',
        },
        'background'
    );

    const textColor = useThemeColor(
        {
            light: type === 'primary' ? '#FFFFFF' : '#000000',
            dark: type === 'primary' ? '#FFFFFF' : '#FFFFFF',
        },
        'text'
    );

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }, style]}
            activeOpacity={0.7}
            {...otherProps}>
            <ThemedText
                style={[styles.text, { color: textColor }]}>
                {title}
            </ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        width: '100%',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
