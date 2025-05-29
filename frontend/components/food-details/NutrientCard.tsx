import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface NutritionComment {
    nutrition_type: string;
    nutrition_comment: string;
    icon?: string;
    nutrition_delta: number;
}

interface NutrientCardProps {
    nutrient: NutritionComment;
}

export const NutrientCard: React.FC<NutrientCardProps> = ({ nutrient }) => {
    const barColor = nutrient.nutrition_delta >= 0 ? '#47b255' : '#FF6B6B';
    const progressPercentage = Math.min(Math.abs(nutrient.nutrition_delta), 100);

    // Map nutrition types to appropriate Ionicons
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
        Protein: 'barbell',
        Fat: 'water',
        Carbohydrate: 'nutrition',
        Fiber: 'leaf',
        Calories: 'flame'
    };

    const iconName = iconMap[nutrient.nutrition_type] || 'information-circle';

    return (
        <View style={styles.cardContainer}>
            <View style={styles.headerRow}>
                <Ionicons name={iconName} size={24} color={barColor} />
                <ThemedText type="defaultSemiBold" style={styles.nutritionType}>
                    {nutrient.nutrition_type}
                </ThemedText>
            </View>

            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressBarFill,
                        { width: `${progressPercentage}%`, backgroundColor: barColor }
                    ]}
                ></View>
            </View>

            <View style={styles.deltaContainer}>
                <ThemedText style={[styles.deltaText, { color: barColor }]}>
                    {nutrient.nutrition_delta > 0 ? '+' : ''}{nutrient.nutrition_delta}%
                </ThemedText>
            </View>

            <ThemedText style={styles.commentText}>
                {nutrient.nutrition_comment}
            </ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        margin: 16,
        marginTop: 0,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    nutritionType: {
        fontSize: 18,
        marginLeft: 10,
        color: '#333',
    },
    progressBar: {
        height: 12,
        backgroundColor: '#EEEEEE',
        borderRadius: 6,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 6,
    },
    deltaContainer: {
        marginBottom: 12,
    },
    deltaText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});
