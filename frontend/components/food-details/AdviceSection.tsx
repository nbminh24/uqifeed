import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface AdviceSectionProps {
    advice: string;
}

export const AdviceSection: React.FC<AdviceSectionProps> = ({ advice }) => {
    return (
        <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Health Advice</ThemedText>
            <View style={styles.feedbackItem}>
                <View style={styles.feedbackIconContainer}>
                    <Ionicons name="information-circle" size={24} color="#163166" />
                </View>
                <View style={styles.feedbackContent}>
                    <ThemedText style={styles.description}>{advice}</ThemedText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        margin: 16,
        marginTop: 0,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    feedbackItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    feedbackIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    feedbackContent: {
        flex: 1,
    },
    description: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});
