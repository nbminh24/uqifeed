require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:3000/api';
const IMAGE_PATH = 'C:\\Users\\USER\\Downloads\\suon-cuu-nuong.webp';
let token;
let foodId;

// Test user credentials
const TEST_USER = {
    email: 'admin@gmail.com',
    password: 'admin'
};

/**
 * Set a mock authentication token 
 * (Since login functionality is not fully implemented yet)
 */
function setMockToken() {
    // Set a fake token for testing purposes
    token = 'mock-auth-token-for-testing';
    console.log('Mock token set for testing.');
}

/**
 * Test uploading and analyzing a food image
 */
async function testAnalyzeAndSaveFood() {
    try {        // Read test image file
        const imageBuffer = fs.readFileSync(IMAGE_PATH);
        const mimeType = 'image/webp'; // Đúng MIME type cho file .webp
        const base64Image = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;

        // Set authorization header
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };        // API call to analyze and save food
        const response = await axios.post(
            `${API_URL}/foods/analyze-and-save`,
            {
                base64Image,
                meal_type_id: 'lunch'  // Đổi thành 'lunch' hoặc một meal type ID có trong hệ thống của bạn
            },
            config
        );

        foodId = response.data.data.food.id;
        console.log('Food analyzed and saved successfully:', response.data.data.food.food_name);
        console.log('Food ID:', foodId);
        console.log('Number of ingredients:', response.data.data.ingredients.length);
    } catch (error) {
        console.error('Food analysis failed:', error.response?.data || error.message);
    }
}

/**
 * Test getting a list of foods
 */
async function testGetFoods() {
    try {
        // Set authorization header
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // API call to get foods
        const response = await axios.get(`${API_URL}/foods`, config);

        console.log('Foods retrieved successfully. Count:', response.data.data.foods.length);

        // Display basic info for each food
        response.data.data.foods.forEach((food, index) => {
            console.log(`${index + 1}. ${food.food_name} (ID: ${food.id})`);
        });
    } catch (error) {
        console.error('Getting foods failed:', error.response?.data || error.message);
    }
}

/**
 * Test getting a specific food by ID
 */
async function testGetFoodById() {
    if (!foodId) {
        console.log('No food ID available. Skipping get food by ID test.');
        return;
    }

    try {
        // Set authorization header
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // API call to get food by ID
        const response = await axios.get(`${API_URL}/foods/${foodId}`, config);

        console.log('Food details retrieved successfully:');
        console.log('- Name:', response.data.data.food.food_name);
        console.log('- Ingredients count:', response.data.data.ingredients.length);

        // Display nutritional info if available
        const food = response.data.data.food;
        if (food.total_protein || food.total_carb || food.total_fat) {
            console.log('- Protein:', food.total_protein || 0, 'g');
            console.log('- Carbs:', food.total_carb || 0, 'g');
            console.log('- Fat:', food.total_fat || 0, 'g');
            console.log('- Fiber:', food.total_fiber || 0, 'g');
            console.log('- Calories:', food.total_calorie || 0, 'kcal');
        } else {
            console.log('- No nutritional data available yet');
        }
    } catch (error) {
        console.error('Getting food by ID failed:', error.response?.data || error.message);
    }
}

/**
 * Test calculating nutrition for a food
 */
async function testCalculateNutrition() {
    if (!foodId) {
        console.log('No food ID available. Skipping nutrition calculation test.');
        return;
    }

    try {
        // Set authorization header
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // API call to calculate nutrition
        const response = await axios.post(
            `${API_URL}/foods/${foodId}/calculate-nutrition`,
            {},
            config
        );

        console.log('Nutrition calculated successfully:');
        const food = response.data.data.food;
        console.log('- Protein:', food.total_protein || 0, 'g');
        console.log('- Carbs:', food.total_carb || 0, 'g');
        console.log('- Fat:', food.total_fat || 0, 'g');
        console.log('- Fiber:', food.total_fiber || 0, 'g');
        console.log('- Calories:', food.total_calorie || 0, 'kcal');
    } catch (error) {
        console.error('Nutrition calculation failed:', error.response?.data || error.message);
    }
}

/**
 * Test updating a food
 */
async function testUpdateFood() {
    if (!foodId) {
        console.log('No food ID available. Skipping update food test.');
        return;
    }

    try {
        // Set authorization header
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // API call to update food
        const response = await axios.put(
            `${API_URL}/foods/${foodId}`,
            {
                food_name: 'Updated Food Name',
                food_advice: {
                    "Nutrition Summary": "Updated nutrition summary",
                    "Healthier Suggestions": "Updated health suggestions",
                    "Consumption Tips": "Updated consumption tips"
                }
            },
            config
        );

        console.log('Food updated successfully:');
        console.log('- New name:', response.data.data.food.food_name);
    } catch (error) {
        console.error('Food update failed:', error.response?.data || error.message);
    }
}

/**
 * Test deleting a food
 * NOTE: This will delete the food! Comment out if you want to keep the test data.
 */
async function testDeleteFood() {
    if (!foodId) {
        console.log('No food ID available. Skipping delete food test.');
        return;
    }

    try {
        // Set authorization header
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // API call to delete food
        const response = await axios.delete(
            `${API_URL}/foods/${foodId}`,
            config
        );

        console.log('Food deleted successfully');
    } catch (error) {
        console.error('Food deletion failed:', error.response?.data || error.message);
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log('=== FOOD API TESTING ===');

    // Use mock token instead of login
    setMockToken();

    console.log('\n--- Test 1: Analyze and Save Food ---');
    await testAnalyzeAndSaveFood();

    console.log('\n--- Test 2: Get Foods List ---');
    await testGetFoods();

    console.log('\n--- Test 3: Get Food by ID ---');
    await testGetFoodById();

    console.log('\n--- Test 4: Calculate Nutrition ---');
    await testCalculateNutrition();

    console.log('\n--- Test 5: Update Food ---');
    await testUpdateFood();

    // Comment this out if you want to keep the test data
    console.log('\n--- Test 6: Delete Food ---');
    await testDeleteFood();

    console.log('\n=== TESTING COMPLETE ===');
}

// Run tests
runTests();
