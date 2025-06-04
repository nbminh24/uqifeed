import React from 'react';
import { Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DetailsHeaderProps {
    title: string;
    onEdit?: () => void;
}

export const DetailsHeader = ({ title, onEdit }: DetailsHeaderProps) => {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                {onEdit && (
                    <TouchableOpacity onPress={onEdit} style={styles.editButton}>
                        <Ionicons name="pencil" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#163166',
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginRight: 8,
    },
    editButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
