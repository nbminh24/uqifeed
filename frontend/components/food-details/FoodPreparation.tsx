import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FoodPreparationProps {
    food_preparation: string | Record<string, string[] | string>;
}

export const FoodPreparation: React.FC<FoodPreparationProps> = ({ food_preparation }) => {
    if (!food_preparation || (typeof food_preparation === 'object' && Object.keys(food_preparation).length === 0)) {
        return null;
    }

    const keyMappings: Record<string, string> = {
        "Cách làm": "Preparation Steps",
        "Cách chế biến": "Cooking Method",
        "Lưu ý": "Notes",
        "Thời gian": "Time Required",
        "Nhiệt độ": "Temperature",
        // Keep English keys as-is
        "Preparation Steps": "Preparation Steps",
        "Cooking Method": "Cooking Method",
        "Notes": "Notes",
        "Time Required": "Time Required",
        "Temperature": "Temperature"
    };

    const renderSteps = (steps: string[] | string) => {
        if (Array.isArray(steps)) {
            return (
                <View style={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <View key={index} style={styles.stepContainer}>
                            <ThemedText style={styles.stepBullet}>•</ThemedText>
                            <ThemedText style={[styles.descriptionText, styles.stepText]}>
                                {step}
                            </ThemedText>
                        </View>
                    ))}
                </View>
            );
        }

        // If it's a string, split it into steps
        const textSteps = steps.split(/(?<=[.!?])\s+/).filter(step => step.trim().length > 0);
        return (
            <View style={styles.stepsContainer}>
                {textSteps.map((step, index) => (
                    <View key={index} style={styles.stepContainer}>
                        <ThemedText style={styles.stepBullet}>•</ThemedText>
                        <ThemedText style={[styles.descriptionText, styles.stepText]}>
                            {step}
                        </ThemedText>
                    </View>
                ))}
            </View>
        );
    };

    const renderSection = (title: string, content: string[] | string) => {
        if (!content || (Array.isArray(content) && content.length === 0)) return null;

        return (
            <View key={title} style={styles.sectionContainer}>
                <ThemedText style={styles.descriptionSubtitle}>
                    {title}
                </ThemedText>
                {renderSteps(content)}
            </View>
        );
    };

    return (
        <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Preparation Guide</ThemedText>
            {typeof food_preparation === 'object' ? (
                <>
                    {Object.entries(food_preparation).map(([key, value]) => {
                        if (!value) return null;
                        const englishTitle = keyMappings[key] || key;
                        return renderSection(englishTitle, value);
                    })}
                </>
            ) : (
                renderSection('Preparation Steps', food_preparation)
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
    sectionContainer: {
        paddingVertical: 9,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 15,
        color: '#444',
        lineHeight: 24,
        flex: 1,
        paddingRight: 8,
    },
    descriptionSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    stepsContainer: {
        marginTop: 8,
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    stepBullet: {
        width: 20,
        marginRight: 8,
        color: '#333',
        fontSize: 25,
        lineHeight: 24,
    },
    stepText: {
        fontWeight: '400',
    }
});
