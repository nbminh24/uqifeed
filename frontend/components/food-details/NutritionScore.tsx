import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface NutritionScoreProps {
    nutritionScore: {
        nutrition_score?: number;
        score?: number;
    } | null;
    inBadgeMode?: boolean;
}

export const NutritionScore: React.FC<NutritionScoreProps> = ({ nutritionScore, inBadgeMode = false }) => {
    const score = nutritionScore?.nutrition_score ?? nutritionScore?.score ?? 0;

    // Get color based on score
    const getScoreColor = (value: number): string => {
        if (value >= 90) return '#2ECC71'; // Excellent - Bright Green
        if (value >= 80) return '#47b255'; // Very Good - Green
        if (value >= 70) return '#82C341'; // Good - Light Green
        if (value >= 60) return '#F1C40F'; // Fair - Yellow
        if (value >= 50) return '#FFA726'; // Moderate - Orange
        if (value >= 40) return '#FF6B6B'; // Poor - Light Red
        if (value >= 30) return '#E74C3C'; // Very Poor - Red
        return '#C0392B'; // Unsuitable - Dark Red
    };

    const scoreColor = getScoreColor(score); if (inBadgeMode) {
        return (
            <View style={[styles.nutritionScoreCircle, styles.nutritionScoreBadge, { backgroundColor: scoreColor }]}>
                <ThemedText style={[
                    styles.nutritionScoreText,
                    styles.badgeScoreText,
                    score > 99 ? styles.smallerScoreText : null
                ]}>{Math.round(score)}</ThemedText>
            </View>
        );
    }

    return (
        <View style={styles.nutritionDetailsContainer}>
            <View style={styles.nutritionScoreRow}>
                <View style={[styles.nutritionScoreCircle, { backgroundColor: scoreColor }]}>
                    <ThemedText style={[
                        styles.nutritionScoreText,
                        score > 99 ? styles.smallerScoreText : null
                    ]}>{Math.round(score)}</ThemedText>
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
        justifyContent: 'center',
    }, nutritionScoreCircle: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        // Đã xóa phần đổ bóng
    }, nutritionScoreBadge: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: 'white',
        // Đã xóa phần đổ bóng
    },
    nutritionScoreText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
        lineHeight: 26, // Helps with vertical centering
        textAlignVertical: 'center',
    },
    badgeScoreText: {
        fontSize: 25, // Larger text for the badge
        lineHeight: 30,
    },
    smallerScoreText: {
        fontSize: 20,
        lineHeight: 22, // Smaller line height for smaller text
    }
});
