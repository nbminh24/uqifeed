import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FoodPreparationProps {
    food_preparation: string | Record<string, string>;
}

export const FoodPreparation: React.FC<FoodPreparationProps> = ({ food_preparation }) => {
    if (!food_preparation || (typeof food_preparation === 'object' && Object.keys(food_preparation).length === 0)) {
        return null;
    }

    const splitIntoSteps = (text: string | undefined) => {
        if (typeof text !== 'string' || !text || text.trim() === '') return [];

        // First try to split by numbered steps (1., 2., etc)
        let steps = text.split(/\d+\.\s+/);

        // If no numbered steps found, split by sentences
        if (steps.length <= 1) {
            steps = text.split(/(?<=[.!?])\s+/);
        }

        return steps
            .map(step => step.trim())
            .filter(step => step.length > 0);
    };

    const renderSteps = (steps: string[]) => (
        <View style={styles.stepsContainer}>
            {steps.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                    <ThemedText style={styles.stepNumber}>{index + 1}.</ThemedText>
                    <ThemedText style={[styles.descriptionText, styles.stepText]}>
                        {step}
                    </ThemedText>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Preparation Guide</ThemedText>
            {typeof food_preparation === 'object' ? (
                <>
                    {Object.entries(food_preparation).map(([key, value]) => {
                        if (!value) return null;
                        const steps = splitIntoSteps(value);
                        if (steps.length === 0) return null;

                        return (
                            <View key={key} style={styles.sectionContainer}>
                                <ThemedText style={styles.descriptionSubtitle}>
                                    {key}
                                </ThemedText>
                                {renderSteps(steps)}
                            </View>
                        );
                    })}
                </>
            ) : (
                renderSteps(splitIntoSteps(String(food_preparation)))
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
        lineHeight: 20,
    },
    descriptionSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
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
    stepNumber: {
        fontSize: 15,
        color: '#444',
        width: 28,
        fontWeight: '600',
        marginRight: 8,
        lineHeight: 20,
    },
    stepText: {
        flex: 1,
        paddingRight: 8,
    },
});
