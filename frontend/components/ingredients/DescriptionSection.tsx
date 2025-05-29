import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface DescriptionSectionProps {
    title: string;
    description: string;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({ title, description }) => {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
                <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
            </View>
            <ThemedText style={styles.descriptionText}>{description}</ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    descriptionText: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
    },
});
