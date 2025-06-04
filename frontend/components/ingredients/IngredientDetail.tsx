import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

export interface IngredientDetailProps {
    name: string;
    amount: string;
    nutritionInfo: {
        carb: number;
        fat: number;
        protein: number;
        fiber: number;
    };
    description: {
        culinaryUse: string;
        nutritionalBenefits: string;
        originDescription: string;
    };
    createdAt: string;
}

export const IngredientDetail: React.FC<IngredientDetailProps> = ({
    name,
    amount,
    nutritionInfo,
    description,
    createdAt
}) => {
    return (
        <View style={styles.container}>            {/* Amount */}
            <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                    <ThemedText style={styles.sectionTitle}>Amount</ThemedText>
                </View>
                <View style={styles.amountContainer}>
                    <Ionicons name="scale" size={24} color="#4CAF50" style={styles.icon} />
                    <ThemedText style={styles.amountText}>{amount}</ThemedText>
                </View>
            </View>

            {/* Nutrition Info */}
            <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                    <ThemedText style={styles.sectionTitle}>Nutrition Information</ThemedText>
                </View>
                <View style={styles.nutritionContainer}>
                    <View style={styles.nutritionItem}>
                        <Ionicons name="nutrition" size={24} color="#FFD166" style={styles.icon} />
                        <ThemedText style={styles.nutritionLabel}>Carbs</ThemedText>
                        <ThemedText style={styles.nutritionValue}>{nutritionInfo.carb} g</ThemedText>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Ionicons name="water" size={24} color="#06D6A0" style={styles.icon} />
                        <ThemedText style={styles.nutritionLabel}>Fat</ThemedText>
                        <ThemedText style={styles.nutritionValue}>{nutritionInfo.fat} g</ThemedText>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Ionicons name="barbell" size={24} color="#118AB2" style={styles.icon} />
                        <ThemedText style={styles.nutritionLabel}>Protein</ThemedText>
                        <ThemedText style={styles.nutritionValue}>{nutritionInfo.protein} g</ThemedText>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Ionicons name="leaf" size={24} color="#8BC34A" style={styles.icon} />
                        <ThemedText style={styles.nutritionLabel}>Fiber</ThemedText>
                        <ThemedText style={styles.nutritionValue}>{nutritionInfo.fiber} g</ThemedText>
                    </View>
                </View>
            </View>

            {/* Description Sections */}
            <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                    <ThemedText style={styles.sectionTitle}>Culinary Use</ThemedText>
                </View>
                <ThemedText style={styles.descriptionText}>{description.culinaryUse}</ThemedText>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                    <ThemedText style={styles.sectionTitle}>Nutritional Benefits</ThemedText>
                </View>
                <ThemedText style={styles.descriptionText}>{description.nutritionalBenefits}</ThemedText>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                    <ThemedText style={styles.sectionTitle}>Origin & Description</ThemedText>
                </View>
                <ThemedText style={styles.descriptionText}>{description.originDescription}</ThemedText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({    container: {
        backgroundColor: '#f9f9f9',
        width: '100%',
    },section: {
        marginHorizontal: 12,
        marginTop: 0,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    nutritionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    nutritionItem: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '48%',
        marginBottom: 16,
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 12,
    }, nutritionLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    nutritionValue: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginTop: 2,
    },
    icon: {
        marginBottom: 4,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
});
