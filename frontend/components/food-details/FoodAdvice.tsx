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
        <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Nutrition Analysis & Advice</ThemedText>

            {typeof food_advice === 'object' ? (
                <>
                    {food_advice['Nutrition Summary'] && (
                        <>
                            <ThemedText style={styles.descriptionSubtitle}>
                                Nutrition Analysis
                            </ThemedText>
                            <ThemedText style={styles.descriptionText}>
                                {food_advice['Nutrition Summary']}{'\n\n'}
                            </ThemedText>
                        </>
                    )}

                    {food_advice['Healthier Suggestions'] && (
                        <>
                            <ThemedText style={[styles.descriptionSubtitle, styles.descriptionSpacing]}>
                                Healthier Suggestions
                            </ThemedText>
                            <ThemedText style={styles.descriptionText}>
                                {food_advice['Healthier Suggestions']}{'\n\n'}
                            </ThemedText>
                        </>
                    )}

                    {food_advice['Consumption Tips'] && (
                        <>
                            <ThemedText style={[styles.descriptionSubtitle, styles.descriptionSpacing]}>
                                Consumption Tips
                            </ThemedText>
                            <ThemedText style={styles.descriptionText}>
                                {food_advice['Consumption Tips']}
                            </ThemedText>
                        </>
                    )}
                </>
            ) : (
                <ThemedText style={styles.descriptionText}>
                    {food_advice}
                </ThemedText>
            )}
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
