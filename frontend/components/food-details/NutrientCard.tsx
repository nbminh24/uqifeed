import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface NutritionComment {
    title: string;
    description: string;
    iconName: string;
    type: string;
    amount: number;
    unit: string;
    progressPercentage: number;
    barColor: string;
}

interface NutrientCardProps {
    nutrient: NutritionComment;
    iconName: React.ComponentProps<typeof Ionicons>['name'];
}

export const NutrientCard: React.FC<NutrientCardProps> = ({ nutrient, iconName }) => {
    return (
        <View style={styles.fiberScoreSection}>
            <View style={styles.fiberHeaderRow}>
                <Ionicons name={iconName} size={24} color={nutrient.barColor} />
                <ThemedText type="defaultSemiBold" style={styles.fiberScoreText}>{nutrient.title}</ThemedText>
            </View>

            <View style={styles.fiberScoreBar}>
                <View
                    style={[
                        styles.fiberScoreProgress,
                        {
                            width: `${nutrient.progressPercentage}%`,
                            backgroundColor: nutrient.barColor
                        }
                    ]}
                ></View>
            </View>

            <View style={styles.fiberScoreValue}>
                <ThemedText
                    style={[
                        styles.fiberAmountText,
                        { color: nutrient.barColor }
                    ]}
                >
                    {nutrient.amount}{nutrient.unit}
                </ThemedText>
            </View>

            <ThemedText style={styles.fiberDescription}>
                {nutrient.description}
            </ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    fiberScoreSection: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        margin: 16,
        marginTop: 0,
    },
    fiberHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    fiberScoreText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333',
    },
    fiberScoreBar: {
        height: 12,
        backgroundColor: '#EEEEEE',
        borderRadius: 6,
        marginBottom: 8,
    },
    fiberScoreProgress: {
        height: '100%',
        borderRadius: 6,
    },
    fiberScoreValue: {
        marginBottom: 12,
    },
    fiberAmountText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    fiberDescription: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
    },
});
