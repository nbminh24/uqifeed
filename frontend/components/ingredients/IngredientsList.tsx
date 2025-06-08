import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Ingredient } from '@/types/food';

interface IngredientsListProps {
    ingredients: Ingredient[];
}

export const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients }) => {
    const router = useRouter();

    if (!ingredients || ingredients.length === 0) {
        return null;
    } const handleIngredientPress = (ingredient: Ingredient) => {
        console.log('Ingredient pressed:', ingredient); // Debug log
        const description = ingredient.ingredient_description || {};
        console.log('Description data:', description); // Debug log

        // Navigate to ingredient detail page
        router.push({
            pathname: '/ingredients',
            params: {
                name: ingredient.ingredient_name,
                amount: ingredient.ingredient_amount,
                description: JSON.stringify(ingredient.ingredient_description || {})
            }
        });
    };

    return (
        <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Ingredients</ThemedText>
            <View style={styles.ingredientsContainer}>
                {ingredients.map((ingredient) => (
                    <TouchableOpacity
                        key={ingredient.id}
                        style={styles.ingredientTag}
                        onPress={() => handleIngredientPress(ingredient)}
                    >
                        <ThemedText style={styles.ingredientText}>
                            {ingredient.ingredient_name}
                            {ingredient.ingredient_amount ? ` (${ingredient.ingredient_amount}g)` : ''}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    ingredientsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    ingredientTag: {
        backgroundColor: '#f0f7ff',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    ingredientText: {
        fontSize: 14,
        color: '#333',
    },
});
