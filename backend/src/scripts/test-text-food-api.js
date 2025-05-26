/**
 * Script to test the Text Food Analysis API endpoints
 * 
 * Run with: node src/scripts/test-text-food-api.js
 */

const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// API base URL
const baseURL = 'http://localhost:5000/api';

// Mock auth token (can be replaced with actual token after login)
// In a real app, you would get this through the login process
const mockToken = 'your_auth_token_here';

// Sample text descriptions
const sampleTexts = [
    "Bông cải xanh luộc với tôm sú và ức gà",
    "Cơm chiên rau củ với thịt bò xào và trứng",
    "Bún chả cá Nha Trang với rau sống và nước mắm"
];

/**
 * Test the analyze-food endpoint
 */
async function testAnalyzeFood() {
    console.log('\n===== Testing Analyze Food Text Endpoint =====\n');

    try {
        const response = await axios.post(`${baseURL}/text-analysis/analyze-food`,
            { textDescription: sampleTexts[0] },
            {
                headers: { Authorization: `Bearer ${mockToken}` }
            }
        );

        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));

        console.log('\n✅ Analyze Food Text Test Completed Successfully');
        return response.data;
    } catch (error) {
        console.error('❌ Error testing analyze-food endpoint:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Test the analyze-and-save endpoint
 */
async function testAnalyzeAndSaveFood() {
    console.log('\n===== Testing Analyze and Save Food Text Endpoint =====\n');

    try {
        const response = await axios.post(`${baseURL}/text-analysis/analyze-and-save`,
            {
                textDescription: sampleTexts[1],
                meal_type_id: 'breakfast' // Use appropriate meal type ID
            },
            {
                headers: { Authorization: `Bearer ${mockToken}` }
            }
        );

        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));

        console.log('\n✅ Analyze and Save Food Text Test Completed Successfully');
        return response.data;
    } catch (error) {
        console.error('❌ Error testing analyze-and-save endpoint:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Test calculating nutrition for the saved food
 */
async function testCalculateNutrition(foodId) {
    console.log('\n===== Testing Calculate Nutrition Endpoint =====\n');

    try {
        const response = await axios.post(`${baseURL}/foods/${foodId}/calculate-nutrition`,
            {},
            {
                headers: { Authorization: `Bearer ${mockToken}` }
            }
        );

        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));

        console.log('\n✅ Calculate Nutrition Test Completed Successfully');
        return response.data;
    } catch (error) {
        console.error('❌ Error testing calculate-nutrition endpoint:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Run all tests in sequence
 */
async function runTests() {
    try {
        // Test analyze food
        await testAnalyzeFood();

        // Test analyze and save food
        const analyzeAndSaveResult = await testAnalyzeAndSaveFood();

        // If the food was saved successfully, test calculating nutrition
        if (analyzeAndSaveResult && analyzeAndSaveResult.data && analyzeAndSaveResult.data.food) {
            const foodId = analyzeAndSaveResult.data.food.id;
            await testCalculateNutrition(foodId);
        }

        console.log('\n✅ All API Tests Completed Successfully');
    } catch (error) {
        console.error('\n❌ API Test Failed:', error.message);
    }
}

// Run the tests
runTests();
