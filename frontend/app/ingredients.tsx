import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { IngredientDetail } from '@/components/ingredients';
import { ThemedView } from '@/components/ThemedView';

export default function IngredientScreen() {
    const params = useLocalSearchParams();
    const ingredientName = params.name as string;
    const ingredientAmount = params.amount as string;
    const rawDescription = params.description ? JSON.parse(params.description as string) : {};

    // Parse nutrition values from the URL parameters
    const nutritionInfo = {
        carb: Number(params.carb) || 0,
        fat: Number(params.fat) || 0,
        protein: Number(params.protein) || 0,
        fiber: Number(params.fiber) || 0
    };

    const ingredientDescription = {
        culinaryUse: rawDescription['Cách dùng trong ẩm thực'] || '',
        nutritionalBenefits: rawDescription['Lợi ích dinh dưỡng'] || '',
        originDescription: rawDescription['Nguồn gốc & mô tả dân dã'] || ''
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Ingredient Details',
                    headerShadowVisible: false,
                }}
            />
            <ScrollView>
                <IngredientDetail
                    name={ingredientName}
                    amount={ingredientAmount}
                    nutritionInfo={nutritionInfo}
                    description={ingredientDescription}
                    createdAt=""
                />
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
