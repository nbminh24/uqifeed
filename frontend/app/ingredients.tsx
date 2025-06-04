import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text, Platform } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { IngredientDetail } from '@/components/ingredients';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

export default function IngredientScreen() {
    const router = useRouter();
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
    }; return (
        <ThemedView style={styles.container}>            <Stack.Screen
            options={{
                headerShown: false,
            }}
        />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                    <Text style={styles.foodName}>{ingredientName}</Text>
                    <Text style={styles.timeText}>Amount: {ingredientAmount}g</Text>
                </View>
            </View>

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
        backgroundColor: '#F5F6FA',
        paddingTop: Platform.OS === 'ios' ? 70 : 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 16,
    },
    headerTitle: {
        flex: 1,
        marginLeft: 12,
    },
    foodName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    timeText: {
        fontSize: 13,
        color: '#6B7280',
    },
});
