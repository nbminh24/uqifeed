import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

interface Ingredient {
    ingredient_name: string;
    ingredient_amount: number;
    ingredient_description?: Record<string, unknown>;
    ingredient_protein?: number;
    ingredient_carb?: number;
    ingredient_fat?: number;
    ingredient_fiber?: number;
}

interface IngredientProps {
    ingredients: Ingredient[];
}

export const IngredientsList: React.FC<IngredientProps> = ({ ingredients }) => {
    const router = useRouter();

    const handleIngredientPress = (ingredient: Ingredient) => {
        // Navigate to the ingredient details screen with all nutrition data
        router.push({
            pathname: '/ingredients',
            params: {
                name: ingredient.ingredient_name,
                amount: `${ingredient.ingredient_amount}g`,
                description: JSON.stringify(ingredient.ingredient_description || {}),
                protein: ingredient.ingredient_protein ?? 0,
                carb: ingredient.ingredient_carb ?? 0,
                fat: ingredient.ingredient_fat ?? 0,
                fiber: ingredient.ingredient_fiber ?? 0
            }
        });
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
                <ThemedText style={styles.sectionTitle}>Ingredients</ThemedText>
            </View>
            <View style={styles.ingredientsContainer}>
                {ingredients.map((ingredient, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.ingredientTag}
                        onPress={() => handleIngredientPress(ingredient)}
                    >
                        <ThemedText style={styles.ingredientText}>
                            {ingredient.ingredient_name}
                        </ThemedText>
                    </TouchableOpacity>
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
