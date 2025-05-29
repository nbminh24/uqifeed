import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FoodPreparationProps {
    food_preparation: string | Record<string, string>;
}

export const FoodPreparation: React.FC<FoodPreparationProps> = ({ food_preparation }) => {
    if (!food_preparation || (typeof food_preparation === 'object' && Object.keys(food_preparation).length === 0)) {
        return null;
    } const splitIntoSteps = (text: string | undefined) => {
        if (typeof text !== 'string' || !text || text.trim() === '') return [];
        return text
            .split(/(?<=[.!?])\s+|\d+\.\s+/)
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
        margin: 16,
        marginTop: 0,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    descriptionText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
    },
    descriptionSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    stepsContainer: {
        marginTop: 8,
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    stepNumber: {
        fontSize: 14,
        color: '#555',
        width: 28,
        marginRight: 8,
        lineHeight: 22,
    },
    stepText: {
        flex: 1,
        paddingRight: 8,
    },
});
