import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import {
    FoodHeader,
    FoodImage,
    NutritionScore,
    CaloriesAndMacros,
    IngredientsList,
    NutrientCard,
    AdviceSection,
    FoodDescription
} from '@/components/food-details';

// Mock data for the food details
const mockFoodData = {
    name: "Pork belly & eggs",
    imageUrl: "https://bucket1.ss-hn-1.vccloud.vn/uploads/general/2019/10/bb1-1570701960835.jpeg",
    date: "Sun, May 4, 3:37 PM",
    fiberScore: "Low in fiber",
    fiberAmount: 0,
    fiberDescription: "Suitable for light meals or snacks, when you have other high-fiber meals during the day.",
    calories: 468,
    protein: 57,
    carbs: 4,
    fats: 25,
    ingredients: [
        "Braising liquid",
        "Green onions",
        "Red chili peppers",
        "Hard boiled eggs",
        "Braised pork belly"
    ], nutritionComments: [
        {
            title: "Calorie",
            description: "This meal is moderately high in calories at 468 kcal, suitable for a substantial lunch or dinner if you're moderately active.",
            iconName: "information-circle" as const,
            type: "info",
            amount: 468,
            unit: "kcal",
            progressPercentage: 60,
            barColor: "#FF6B6B"
        }, {
            title: "Carbs",
            description: "Very low in carbohydrates (4g), making this meal suitable for low-carb or ketogenic diets.",
            iconName: "checkmark-circle" as const,
            type: "positive",
            amount: 4,
            unit: "g",
            progressPercentage: 5,
            barColor: "#FFD166"
        }, {
            title: "Protein",
            description: "Excellent source of protein (57g), exceeding the recommended amount for a single meal. Great for muscle maintenance and repair.",
            iconName: "checkmark-circle" as const,
            type: "positive",
            amount: 57,
            unit: "g",
            progressPercentage: 90,
            barColor: "#118AB2"
        }, {
            title: "Fat",
            description: "Contains 25g of fat, mostly from pork belly. Consider balancing with lower-fat meals throughout the day.",
            iconName: "warning" as const,
            type: "warning",
            amount: 25,
            unit: "g",
            progressPercentage: 40,
            barColor: "#06D6A0"
        }, {
            title: "Fiber",
            description: "Very low in fiber (0g). Consider adding vegetables or whole grains to increase fiber content for digestive health.",
            iconName: "warning" as const,
            type: "warning",
            amount: 0,
            unit: "g",
            progressPercentage: 0,
            barColor: "#8BC34A"
        }
    ],
    improvements: [
        {
            title: "Reduce saturated fat",
            description: "Choose leaner cuts of pork or substitute the pork belly with chicken breast or fish for a lower-fat option.",
            iconName: "warning" as const,
            type: "improve"
        }
    ],
    positives: [
        {
            title: "Choosing protein-rich ingredients",
            description: "You've included braised pork belly and hard-boiled eggs, which are excellent sources of protein, essential for building and repairing tissues.",
            iconName: "checkmark-circle" as const,
            type: "keep"
        },
        {
            title: "Adding green onions",
            description: "Green onions are a good source of vitamins, minerals, and antioxidants, which can contribute to overall health and well-being.",
            iconName: "checkmark-circle" as const,
            type: "keep"
        }
    ],
    tags: ["High Protein", "Low Carb", "Keto-Friendly"]
};

export default function FoodDetailsScreen() {
    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{
                title: 'Food Details',
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#163166',
                },
                headerTintColor: '#fff',
            }} />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header with Title and Date */}
                <FoodHeader title={mockFoodData.name} date={mockFoodData.date} />

                {/* Food Image Section */}
                <FoodImage imageUrl={mockFoodData.imageUrl} />

                {/* Nutrition Score Details */}
                <NutritionScore score={99} description="Excellent nutrition balance" />

                {/* Food Description Section */}
                <FoodDescription description={{
                    flavors: "Takoyaki has a mildly sweet and savory taste, crispy on the outside, and soft on the inside. KFC chicken is salty, spicy, aromatic, crispy, and rich. Spicy seafood noodles have an intense heat with a fragrant seafood aroma and rich flavor profile.",
                    origin: "Takoyaki is a famous Japanese street food made from wheat flour batter, octopus, and various ingredients. KFC is an American-style fast food, prepared with KFC's secret recipe. Spicy seafood noodles are popular in many Asian countries, especially Korea and Vietnam, featuring a combination of noodles, seafood, and spicy sauce.",
                    preparation: "Takoyaki is grilled in a special mold that creates round shapes. KFC chicken is marinated with spices and deep-fried. Spicy seafood noodles are cooked with a spicy broth, seafood, and noodles."
                }} />

                {/* Calories & Macros Card */}
                <CaloriesAndMacros
                    calories={mockFoodData.calories}
                    macros={{
                        carbs: mockFoodData.carbs,
                        fats: mockFoodData.fats,
                        protein: mockFoodData.protein
                    }}
                />

                {/* Ingredients Section */}
                <IngredientsList ingredients={mockFoodData.ingredients} />

                {/* Nutrient Cards */}
                <NutrientCard nutrient={mockFoodData.nutritionComments[0]} iconName="flame" />
                <NutrientCard nutrient={mockFoodData.nutritionComments[1]} iconName="nutrition" />
                <NutrientCard nutrient={mockFoodData.nutritionComments[2]} iconName="barbell" />
                <NutrientCard nutrient={mockFoodData.nutritionComments[3]} iconName="water" />
                <NutrientCard nutrient={mockFoodData.nutritionComments[4]} iconName="leaf" />

                {/* Advice Section */}
                <AdviceSection feedbackItems={mockFoodData.positives} />

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
    }, header: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        paddingBottom: 10,
        alignItems: 'center',
    },
    foodTitle: {
        fontSize: 22,
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    fiberScoreSection: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        margin: 16,
        marginTop: 0,
    },
    fiberHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    fiberScoreText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333',
    },
    fiberScoreBar: {
        height: 12,
        backgroundColor: '#EEEEEE',
        borderRadius: 6,
        marginBottom: 8,
    },
    fiberScoreProgress: {
        width: '10%', // Adjust based on fiber score
        height: '100%',
        backgroundColor: '#FF6B6B',
        borderRadius: 6,
    },
    fiberScoreValue: {
        marginBottom: 12,
    },
    fiberAmountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    fiberDescription: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
    }, imageContainer: {
        width: 300,
        height: 300,
        borderRadius: 150,
        overflow: 'hidden',
        marginVertical: 16,
        position: 'relative',
        alignSelf: 'center',
    },
    foodImage: {
        width: '100%',
        height: '100%',
    }, mascotContainer: {
        position: 'absolute',
        left: 16,
        bottom: 16,
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }, mascotImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    }, nutritionScoreCircle: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: '#47b255',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    }, nutritionScoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    smallerScoreText: {
        fontSize: 20,
    }, nutritionScoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        margin: 16,
        marginBottom: 0,
    }, nutritionDetailsContainer: {
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
    },
    nutritionScoreBadge: {
        position: 'absolute',
        right: 20,
        top: -20,
        zIndex: 10,
    },
    nutritionScoreDetails: {
        marginLeft: 16,
        flex: 1,
    },
    nutritionScoreLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    nutritionScoreDescription: {
        fontSize: 14,
        color: '#666',
    },
    nutritionCard: {
        margin: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    nutritionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    adjustButton: {
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 16,
    },
    adjustButtonText: {
        color: '#333',
        fontSize: 14,
    },
    caloriesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    caloriesValue: {
        fontSize: 32,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    caloriesUnit: {
        fontSize: 16,
        color: '#888',
        marginLeft: 4,
        alignSelf: 'flex-end',
        marginBottom: 4,
    },
    macrosBars: {
        height: 8,
        flexDirection: 'row',
        marginBottom: 16,
    },
    carbsBar: {
        flex: 1,
        height: '100%',
        backgroundColor: '#FFD166',
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    fatsBar: {
        flex: 5,
        height: '100%',
        backgroundColor: '#06D6A0',
    },
    proteinsBar: {
        flex: 10,
        height: '100%',
        backgroundColor: '#118AB2',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    macrosLegendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    macroLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    macroLegendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    carbsDot: {
        backgroundColor: '#FFD166',
    },
    fatsDot: {
        backgroundColor: '#06D6A0',
    },
    proteinsDot: {
        backgroundColor: '#118AB2',
    },
    macroLegendTitle: {
        fontSize: 14,
        color: '#666',
        marginRight: 4,
    },
    macroValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
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
    }, ingredientTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecf6ed',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    }, ingredientText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    ingredientIcon: {
        marginRight: 6,
    },
    feedbackItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    feedbackIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    feedbackContent: {
        flex: 1,
    },
    feedbackTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    feedbackDescription: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#e8f0fe',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color: '#163166',
        fontSize: 14,
    },
    actionButtonsContainer: {
        paddingHorizontal: 16,
        marginVertical: 16,
    },
    actionButton: {
        marginVertical: 8,
    }, bottomPadding: {
        height: 20,
    }, descriptionText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    descriptionSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    descriptionSpacing: {
        marginTop: 16,
    },
});
