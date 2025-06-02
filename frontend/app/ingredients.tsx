import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import {
    IngredientHeader,
    IngredientAmount,
    NutritionInfo,
    DescriptionSection
} from '@/components/ingredients';

export default function IngredientScreen() {
    const params = useLocalSearchParams();
    console.log('Received params:', params); // Debug log

    const ingredientName = params.name as string;
    const ingredientAmount = params.amount as string;
    const rawDescription = params.description ? JSON.parse(params.description as string) : {};
    console.log('Parsed description:', rawDescription); // Debug log

    const ingredientDescription = {
        culinaryUse: rawDescription['Cách dùng trong ẩm thực'] || '',
        nutritionalBenefits: rawDescription['Lợi ích dinh dưỡng'] || '',
        originDescription: rawDescription['Nguồn gốc & mô tả dân dã'] || ''
    };

    const nutritionInfo = {
        carb: 10,
        fat: 1,
        protein: 2,
        fiber: 2
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Ingredient Details',
                    headerShadowVisible: false,
                }}
            />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <IngredientHeader
                    name={ingredientName}
                    createdAt={new Date().toLocaleDateString()}
                />

                <IngredientAmount
                    amount={ingredientAmount}
                />

                <NutritionInfo
                    nutritionInfo={nutritionInfo}
                />                <DescriptionSection
                    title="Culinary Use"
                    description={ingredientDescription.culinaryUse || 'Chưa có thông tin về cách dùng trong ẩm thực.'}
                />

                <DescriptionSection
                    title="Nutritional Benefits"
                    description={ingredientDescription.nutritionalBenefits || 'Chưa có thông tin về lợi ích dinh dưỡng.'}
                />

                <DescriptionSection
                    title="Origin Description"
                    description={ingredientDescription.originDescription || 'Chưa có thông tin về nguồn gốc và mô tả.'}
                />

                <View style={styles.bottomPadding} />
            </ScrollView>
        </ThemedView>
    );
}

// ✅ styles đặt ngoài component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollView: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    actionButton: {
        minWidth: 120,
    },
    bottomPadding: {
        height: 40,
    },
});
