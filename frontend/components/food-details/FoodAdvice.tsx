import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FoodAdviceProps {
    food_advice: string | Record<string, string>;
}

export const FoodAdvice: React.FC<FoodAdviceProps> = ({ food_advice }) => {
    // Check if object exists and has content
    const hasAdvice = food_advice &&
        typeof food_advice === 'object' &&
        Object.keys(food_advice).length > 0;

    if (!hasAdvice && !food_advice) {
        return null;
    }

    return (
        <View style={styles.section}>            <ThemedText style={styles.sectionTitle}>Nutrition Analysis & Advice</ThemedText>

            {typeof food_advice === 'object' ? (
                <>
                    {food_advice['Nutrition Summary'] && (
                        <View style={styles.sectionGroup}>
                            <View style={styles.sectionHeaderContainer}>
                                <ThemedText style={styles.descriptionSubtitle}>
                                    Nutrition Analysis
                                </ThemedText>
                            </View>
                            <ThemedText style={styles.descriptionText}>
                                {food_advice['Nutrition Summary']}
                            </ThemedText>
                        </View>
                    )}

                    {food_advice['Healthier Suggestions'] && (
                        <View style={styles.sectionGroup}>
                            <View style={styles.sectionHeaderContainer}>
                                <ThemedText style={styles.descriptionSubtitle}>
                                    Healthier Suggestions
                                </ThemedText>
                            </View>
                            <ThemedText style={styles.descriptionText}>
                                {food_advice['Healthier Suggestions']}
                            </ThemedText>
                        </View>
                    )}

                    {food_advice['Consumption Tips'] && (
                        <View style={styles.sectionGroup}>
                            <View style={styles.sectionHeaderContainer}>
                                <ThemedText style={styles.descriptionSubtitle}>
                                    Consumption Tips
                                </ThemedText>
                            </View>
                            <ThemedText style={styles.descriptionText}>
                                {food_advice['Consumption Tips']}
                            </ThemedText>
                        </View>
                    )}
                </>
            ) : (
                <View style={styles.sectionGroup}>
                    <ThemedText style={styles.descriptionText}>
                        {food_advice}
                    </ThemedText>
                </View>
            )}
        </View>
    );
};

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
    descriptionText: {
        fontSize: 15,
        color: '#444',
        lineHeight: 20,
        marginBottom: 6,
    },
    descriptionSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
});
