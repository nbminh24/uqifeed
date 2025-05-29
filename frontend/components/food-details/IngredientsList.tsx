import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface Ingredient {
    ingredient_name: string;
    ingredient_amount: number;
    ingredient_description?: Record<string, unknown>;
}

interface IngredientProps {
    ingredients: Ingredient[];
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
                        <ThemedText style={styles.ingredientText}>
                            {ingredient.ingredient_name}
                            {ingredient.ingredient_amount ? ` (${ingredient.ingredient_amount}g)` : ''}
                        </ThemedText>
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
    }
});
