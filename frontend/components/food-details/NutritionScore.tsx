import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface NutritionScoreProps {
    score: number;
    description: string;
}

export const NutritionScore: React.FC<NutritionScoreProps> = ({ score, description }) => {
    return (
        <View style={styles.nutritionDetailsContainer}>
            <View style={styles.nutritionScoreRow}>
                <View style={styles.nutritionScoreCircle}>
                    <ThemedText style={[
                        styles.nutritionScoreText,
                        score > 99 ? styles.smallerScoreText : null
                    ]}>{score}</ThemedText>
                </View>
                <View style={styles.nutritionScoreDetails}>
                    <ThemedText style={styles.nutritionScoreLabel}>Nutrition Score</ThemedText>
                    <ThemedText style={styles.nutritionScoreDescription}>{description}</ThemedText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    nutritionDetailsContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        margin: 16,
        marginTop: 8,
        marginBottom: 0,
    },
    nutritionScoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nutritionScoreCircle: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: '#47b255',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    nutritionScoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    smallerScoreText: {
        fontSize: 20,
    },
    nutritionScoreDetails: {
        marginLeft: 16,
        flex: 1,
    },
    nutritionScoreLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    nutritionScoreDescription: {
        fontSize: 14,
        color: '#666',
    },
});
