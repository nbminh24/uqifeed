import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface IngredientProps {
    ingredients: string[];
}

export const IngredientsList: React.FC<IngredientProps> = ({ ingredients }) => {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
                <ThemedText style={styles.sectionTitle}>Ingredients</ThemedText>
            </View>
            <View style={styles.ingredientsContainer}>
                {ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientTag}>
                        <Ionicons name="restaurant" size={18} color="#4CAF50" style={styles.ingredientIcon} />
                        <ThemedText style={styles.ingredientText}>{ingredient}</ThemedText>
                    </View>
                ))}
            </View>
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
        marginBottom: 12,
    },
    ingredientsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    ingredientTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecf6ed',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    ingredientText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    ingredientIcon: {
        marginRight: 6,
    },
});
