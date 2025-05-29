import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FoodDescriptionProps {
    description: {
        flavors: string;
        origin: string;
        preparation: string;
    };
}

export const FoodDescription: React.FC<FoodDescriptionProps> = ({ description }) => {
    return (
        <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Description</ThemedText>

            <ThemedText style={styles.descriptionSubtitle}>Distinctive Flavors</ThemedText>
            <ThemedText style={styles.descriptionText}>
                {description.flavors}
            </ThemedText>

            <ThemedText style={[styles.descriptionSubtitle, styles.descriptionSpacing]}>
                Origin and Cultural Significance
            </ThemedText>
            <ThemedText style={styles.descriptionText}>
                {description.origin}
            </ThemedText>

            <ThemedText style={[styles.descriptionSubtitle, styles.descriptionSpacing]}>
                Traditional Preparation Methods
            </ThemedText>
            <ThemedText style={styles.descriptionText}>
                {description.preparation}
            </ThemedText>
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
    descriptionText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    descriptionSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    descriptionSpacing: {
        marginTop: 16,
    },
});
