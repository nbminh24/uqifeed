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
            <View style={styles.sectionHeaderContainer}>
                <ThemedText style={styles.descriptionSubtitle}>
                    {title}
                </ThemedText>
            </View>
            {content
                .split('\n')
                .map((paragraph, index) =>
                    paragraph.trim() ? (
                        <ThemedText
                            key={index}
                            style={[
                                styles.descriptionText,
                                index === content.split('\n').length - 1 && { marginBottom: 0 } // bỏ margin cuối
                            ]}
                        >
                            {paragraph.trim()}
                        </ThemedText>
                    ) : null
                )}
        </View>
    );
    // Handle string case
    if (typeof food_description === 'string') {
        return (
            <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Food Description</ThemedText>
                <View style={styles.sectionGroup}>
                    <View style={styles.sectionHeaderContainer}>
                        <ThemedText style={styles.descriptionSubtitle}>Overview</ThemedText>
                    </View>
                    <ThemedText style={styles.descriptionText}>
                        {food_description.trim()}
                    </ThemedText>
                </View>
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

// Styles for the food description section
const styles = StyleSheet.create({
    section: {
        marginHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 12,
    },
    sectionGroup: {
        paddingVertical: 9,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginTop: 12, // tạo khoảng cách nhỏ với section phía trên
        borderTopWidth: 1,           // thêm đường gạch phía trên
        borderTopColor: '#e0e0e0',   // màu nhạt hơn một chút
    },

    descriptionText: {
        fontSize: 15,
        color: '#444',
        lineHeight: 20,
        marginBottom: 6, // đủ tạo khoảng cách nhẹ giữa các đoạn
    },

    descriptionSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    }
});
