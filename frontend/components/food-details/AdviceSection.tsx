import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface FeedbackItem {
    title: string;
    description: string;
    iconName: string;
    type: string;
}

interface AdviceSectionProps {
    feedbackItems: FeedbackItem[];
}

export const AdviceSection: React.FC<AdviceSectionProps> = ({ feedbackItems }) => {
    return (
        <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Advice</ThemedText>
            {feedbackItems.map((item, index) => (
                <View key={index} style={styles.feedbackItem}>
                    <View style={styles.feedbackIconContainer}>
                        <Ionicons name={item.iconName} size={24} color="#47b255" />
                    </View>
                    <View style={styles.feedbackContent}>
                        <ThemedText style={styles.feedbackTitle}>{item.title}</ThemedText>
                        <ThemedText style={styles.feedbackDescription}>{item.description}</ThemedText>
                    </View>
                </View>
            ))}
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
    feedbackTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    feedbackDescription: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});
