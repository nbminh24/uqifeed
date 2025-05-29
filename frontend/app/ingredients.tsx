import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import {
    IngredientHeader,
    IngredientAmount,
    NutritionInfo,
    DescriptionSection
} from '@/components/ingredients';

// Mock data for ingredient details
const mockIngredientData = {
    name: "Nghệ tươi",
    amount: "50 gram",
    nutritionInfo: {
        carb: 10,
        fat: 1,
        protein: 2,
        fiber: 2
    },
    description: {
        culinaryUse: "Nghệ được dùng trong nhiều món ăn, nhất là các món cá, tạo màu sắc bắt mắt và tăng hương vị.",
        nutritionalBenefits: "Nghệ có tác dụng chống viêm, tốt cho hệ tiêu hóa.",
        originDescription: "Nghệ tươi có vị cay nhẹ, mùi thơm đặc trưng. Thường dùng làm gia vị, tạo màu vàng đẹp mắt cho món ăn."
    },
    createdAt: "Sun, May 25, 2:15 PM"
};

export default function IngredientScreen() {
    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{
                title: 'Ingredient Details',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#163166',
                },
                headerTintColor: '#fff',
            }} />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Ingredient Header */}
                <IngredientHeader
                    name={mockIngredientData.name}
                    createdAt={mockIngredientData.createdAt}
                />

                {/* Ingredient Amount */}
                <IngredientAmount
                    amount={mockIngredientData.amount}
                />

                {/* Nutrition Information */}
                <NutritionInfo
                    nutritionInfo={mockIngredientData.nutritionInfo}
                />

                {/* Description Sections */}
                <DescriptionSection
                    title="Culinary Use"
                    description={mockIngredientData.description.culinaryUse}
                />

                <DescriptionSection
                    title="Nutritional Benefits"
                    description={mockIngredientData.description.nutritionalBenefits}
                />

                <DescriptionSection
                    title="Origin & Description"
                    description={mockIngredientData.description.originDescription}
                />

                {/* Action Button */}
                <View style={styles.actionButtonsContainer}>
                    <Button
                        title="Save"
                        type="primary"
                        style={styles.actionButton}
                    />
                </View>

                {/* Bottom padding */}
                <View style={styles.bottomPadding} />
            </ScrollView>
        </ThemedView>
    );
}

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
