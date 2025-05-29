import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FoodDescriptionInfoProps {
    food_description: string | Record<string, string>;
}

export const FoodDescriptionInfo: React.FC<FoodDescriptionInfoProps> = ({ food_description }) => {
    if (!food_description) {
        return null;
    }

    // Helper function to render a section
    const renderSection = (title: string, content: string) => (
        <View style={styles.sectionGroup} key={title}>
            <ThemedText style={styles.descriptionSubtitle}>
                {title}
            </ThemedText>
            <ThemedText style={styles.descriptionText}>
                {content}
            </ThemedText>
        </View>
    );

    // Handle string case
    if (typeof food_description === 'string') {
        return (
            <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Description</ThemedText>
                {renderSection('General Description', food_description)}
            </View>
        );
    }

    // Object case - Define key mappings
    const keyMappings: Record<string, string> = {
        'Nguồn gốc và ý nghĩa văn hóa': 'Origin and Cultural Significance',
        'Hương vị đặc trưng': 'Distinctive Flavor',
        'Phương pháp chế biến truyền thống': 'Traditional Cooking Method',
        // Include English keys as-is
        'Origin and Cultural Significance': 'Origin and Cultural Significance',
        'Distinctive Flavor': 'Distinctive Flavor',
        'Traditional Cooking Method': 'Traditional Cooking Method',
    };

    // Handle object case
    if (!Object.keys(food_description).length) {
        return null;
    }

    const sections = Object.entries(food_description).map(([key, value]) => {
        // Find the English title for the section
        const englishTitle = keyMappings[key] || key;
        // Only render if we have both a title and content
        if (englishTitle && value) {
            return renderSection(englishTitle, value);
        }
        return null;
    }).filter(section => section !== null);

    if (sections.length === 0) {
        return null;
    }

    return (
        <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Description</ThemedText>
            {sections}
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
    sectionGroup: {
        marginBottom: 20,
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
        marginBottom: 12,
    },
    descriptionSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    }
});
