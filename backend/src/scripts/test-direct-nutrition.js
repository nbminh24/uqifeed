/**
 * Script to test direct nutrition processing without saving to database
 * 
 * Run with: node src/scripts/test-direct-nutrition.js
 */

const path = require('path');
const fs = require('fs');
const DirectNutritionProcessor = require('../services/directNutritionProcessor');

console.log('Current working directory:', process.cwd());
const envPath = path.join(__dirname, '../../.env');
console.log('Trying to load .env from:', envPath);

// Tải biến môi trường từ đường dẫn tuyệt đối
require('dotenv').config({ path: envPath });

// Sample food data (similar to what would be returned from Gemini AI)
const sampleFoodData = {
    foodName: "Bông cải xanh luộc với tôm sú và ức gà",
    foodDescription: {
        "Nguồn gốc và ý nghĩa văn hóa": "Món ăn này không có nguồn gốc văn hóa cụ thể, là sự kết hợp đơn giản của các nguyên liệu phổ biến, dễ tìm thấy trong nhiều nền ẩm thực.",
        "Hương vị đặc trưng": "Món ăn có vị ngọt thanh của bông cải xanh, vị ngọt tự nhiên và dai của tôm sú, vị mềm và nhạt của ức gà. Tổng thể món ăn có vị thanh đạm.",
        "Phương pháp chế biến truyền thống": "Phương pháp chế biến chính là luộc."
    },
    foodIngredientList: [
        {
            "Ingredient Name": "Bông cải xanh",
            "Ingredient Amount": "200g",
            "Ingredient Protein": "2g",
            "Ingredient Carb": "7g",
            "Ingredient Fat": "0.5g",
            "Ingredient Fiber": "2g",
            "Ingredient Description": {
                "Nguồn gốc & mô tả dân dã": "Loại rau họ cải, giàu vitamin và khoáng chất",
                "Lợi ích dinh dưỡng": "Chứa nhiều vitamin C, K, chất xơ và chất chống oxy hóa",
                "Cách dùng trong ẩm thực": "Thường được luộc, hấp hoặc xào"
            }
        },
        {
            "Ingredient Name": "Tôm sú",
            "Ingredient Amount": "150g",
            "Ingredient Protein": "25g",
            "Ingredient Carb": "1g",
            "Ingredient Fat": "2g",
            "Ingredient Fiber": "0g",
            "Ingredient Description": {
                "Nguồn gốc & mô tả dân dã": "Hải sản phổ biến ở Việt Nam",
                "Lợi ích dinh dưỡng": "Giàu protein, selen, vitamin B12",
                "Cách dùng trong ẩm thực": "Luộc, hấp, xào, nướng"
            }
        },
        {
            "Ingredient Name": "Ức gà",
            "Ingredient Amount": "150g",
            "Ingredient Protein": "30g",
            "Ingredient Carb": "0g",
            "Ingredient Fat": "3g",
            "Ingredient Fiber": "0g",
            "Ingredient Description": {
                "Nguồn gốc & mô tả dân dã": "Phần thịt nạc từ lườn gà",
                "Lợi ích dinh dưỡng": "Giàu protein nạc, ít chất béo",
                "Cách dùng trong ẩm thực": "Luộc, hấp, nướng, xào"
            }
        }
    ],
    foodAdvice: {
        "Nutrition Summary": "Món ăn cung cấp lượng protein khá cao từ tôm và ức gà, cùng với vitamin và chất xơ từ bông cải xanh. Nó là một món ăn tương đối ít chất béo và carbohydrate.",
        "Healthier Suggestions": "Để món ăn lành mạnh hơn, nên hạn chế thêm dầu mỡ trong quá trình chế biến. Có thể thêm gia vị nhẹ nhàng như muối, tiêu, tỏi, gừng để tăng hương vị thay vì dùng nước chấm nhiều dầu mỡ.",
        "Consumption Tips": "Món ăn thích hợp làm món ăn phụ trong bữa chính. Nên ăn với lượng vừa phải, kết hợp với các món ăn khác để cân bằng dinh dưỡng."
    },
    foodPreparation: {
        "Cách làm": [
            "Bước 1: Rửa sạch bông cải xanh, tách nhỏ thành từng bông vừa ăn.",
            "Bước 2: Rửa sạch tôm sú và ức gà.",
            "Bước 3: Cho bông cải xanh vào luộc chín tới (khoảng 3-5 phút).",
            "Bước 4: Cho tôm sú và ức gà vào luộc cùng bông cải xanh (tôm và gà chín nhanh hơn bông cải, nên cho vào sau).",
            "Bước 5: Vớt ra, để ráo nước và dùng nóng."
        ]
    }
};

// Sample target nutrition (matching the structure used in the application)
const sampleTargetNutrition = {
    id: 'sample-target-nutrition-id',
    userId: 'nR3t7mJhxhIdQvTqSIqX', // Using real admin user ID
    profileId: 'sample-profile-id',
    daily: {
        calories: 2500,
        protein: 125, // g (20% of calories)
        fat: 83, // g (30% of calories)
        carbs: 313, // g (50% of calories)
        fiber: 30 // g
    },
    meals: {
        breakfast: {
            calories: 625, // 25% of daily
            protein: 31.25,
            fat: 20.75,
            carbs: 78.25,
            fiber: 7.5
        },
        lunch: {
            calories: 875, // 35% of daily
            protein: 43.75,
            fat: 29.05,
            carbs: 109.55,
            fiber: 10.5
        },
        dinner: {
            calories: 750, // 30% of daily
            protein: 37.5,
            fat: 24.9,
            carbs: 93.9,
            fiber: 9
        },
        snack: {
            calories: 250, // 10% of daily
            protein: 12.5,
            fat: 8.3,
            carbs: 31.3,
            fiber: 3
        }
    },
    calculations: {
        bmr: 1850,
        tdee: 2500,
        goal: 'maintain'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

/**
 * Test total nutrition calculation
 */
async function testTotalNutrition() {
    console.log('\n===== Testing Total Nutrition Calculation =====\n');

    try {
        const ingredients = DirectNutritionProcessor.processIngredients(sampleFoodData.foodIngredientList);
        console.log('Processed Ingredients:', JSON.stringify(ingredients, null, 2));

        const totalNutrition = DirectNutritionProcessor.calculateTotalNutrition(ingredients);
        console.log('Total Nutrition:', JSON.stringify(totalNutrition, null, 2));

        console.log('\n✅ Total Nutrition Test Completed Successfully');
        return totalNutrition;
    } catch (error) {
        console.error('❌ Error testing total nutrition:', error);
        throw error;
    }
}

/**
 * Test nutrition score calculation
 */
async function testNutritionScore(foodWithNutrition) {
    console.log('\n===== Testing Nutrition Score Calculation =====\n');

    try {
        const nutritionScore = DirectNutritionProcessor.calculateNutritionScore(
            foodWithNutrition,
            sampleTargetNutrition
        );

        console.log('Nutrition Score:', JSON.stringify(nutritionScore, null, 2));

        console.log('\n✅ Nutrition Score Test Completed Successfully');
        return nutritionScore;
    } catch (error) {
        console.error('❌ Error testing nutrition score:', error);
        throw error;
    }
}

/**
 * Test nutrition comments generation
 */
async function testNutritionComments(foodWithNutrition) {
    console.log('\n===== Testing Nutrition Comments Generation =====\n');

    try {
        const comments = DirectNutritionProcessor.generateNutritionComments(
            foodWithNutrition,
            sampleTargetNutrition,
            'lunch'
        );

        console.log('Nutrition Comments:', JSON.stringify(comments, null, 2));

        console.log('\n✅ Nutrition Comments Test Completed Successfully');
        return comments;
    } catch (error) {
        console.error('❌ Error testing nutrition comments:', error);
        throw error;
    }
}

/**
 * Test complete processing in one step
 */
async function testCompleteProcessing() {
    console.log('\n===== Testing Complete Processing =====\n');

    try {
        const completeAnalysis = DirectNutritionProcessor.processComplete(
            sampleFoodData,
            sampleTargetNutrition,
            'lunch'
        );

        console.log('Complete Analysis Result:');
        console.log('- Food with Nutrition:', JSON.stringify(completeAnalysis.food, null, 2));
        console.log('- Nutrition Score:', completeAnalysis.nutritionScore.nutrition_score);
        console.log('- Number of Comments:', Object.keys(completeAnalysis.nutritionComments).length);

        console.log('\n✅ Complete Processing Test Completed Successfully');
        return completeAnalysis;
    } catch (error) {
        console.error('❌ Error testing complete processing:', error);
        throw error;
    }
}

// Execute tests
(async () => {
    try {
        // Test individual components
        const totalNutrition = await testTotalNutrition();

        // Create food with nutrition
        const foodWithNutrition = {
            ...sampleFoodData,
            ...totalNutrition
        };

        await testNutritionScore(foodWithNutrition);
        await testNutritionComments(foodWithNutrition);

        // Test complete processing
        await testCompleteProcessing();

        console.log('\n✅ All Tests Completed Successfully');
    } catch (error) {
        console.error('\n❌ Testing Failed:', error);
    }
})();
