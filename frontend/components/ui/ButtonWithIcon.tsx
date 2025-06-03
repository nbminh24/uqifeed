import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonWithIconProps {
    title: string;
    onPress: () => void;
    icon: React.ReactNode;
    type?: 'primary' | 'secondary';
    disabled?: boolean;
}

export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
    title,
    onPress,
    icon,
    type = 'primary',
    disabled = false
}) => {
    const backgroundColor = type === 'primary' ? '#163166' : '#E0E0E0';
    const textColor = type === 'primary' ? '#FFFFFF' : '#163166';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor },
                disabled && styles.disabledButton
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            {icon}
            <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    disabledButton: {
        opacity: 0.5,
    }
});
