import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TitleHeaderProps {
    title: string;
    onEdit?: () => void;
}

export const TitleHeader = ({ title, onEdit }: TitleHeaderProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            {onEdit && (
                <TouchableOpacity onPress={onEdit} style={styles.editButton}>
                    <Ionicons name="pencil" size={20} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#163166',
    },
    title: {
        flex: 1,
        fontSize: 17,
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
