/**
 * Script to test food text analysis with Gemini API
 * 
 * Run with: node src/scripts/test-food-text-analysis.js
 */

const path = require('path');
const fs = require('fs');

console.log('Current working directory:', process.cwd());
const envPath = path.join(__dirname, '../../.env');
console.log('Trying to load .env from:', envPath);
console.log('Does .env file exist?', fs.existsSync(envPath));

// Tải biến môi trường từ đường dẫn tuyệt đối
require('dotenv').config({ path: envPath });

// Kiểm tra API key
console.log('GEMINI_API_KEY from script:', process.env.GEMINI_API_KEY ? 'Defined' : 'Undefined');

const geminiService = require('../services/geminiService');
const TextAnalyzerService = require('../services/textAnalyzerService');

// Sample food text descriptions
const sampleTexts = [
    "Bông cải xanh luộc với tôm sú và ức gà",
    "Cơm chiên rau củ với thịt bò xào và trứng",
    "Bún chả cá Nha Trang với rau sống và nước mắm"
];

async function testTextAnalysis() {
    console.log('\n===== Testing Text Analysis =====\n');

    try {
        // Test with first sample text
        const textDescription = sampleTexts[0];
        console.log(`Analyzing text: "${textDescription}"`);

        const result = await TextAnalyzerService.processText(textDescription);

        console.log('\nAnalysis Results:');
        console.log('Food Name:', result.foodData.foodName);
        console.log('\nFood Description:', JSON.stringify(result.foodData.foodDescription, null, 2));

        console.log('\nIngredients:');
        result.foodData.foodIngredientList.forEach((ingredient, index) => {
            console.log(`\nIngredient ${index + 1}:`);
            console.log(`- Name: ${ingredient['Ingredient Name']}`);
            console.log(`- Amount: ${ingredient['Ingredient Amount']}`);
            console.log(`- Protein: ${ingredient['Ingredient Protein']}`);
            console.log(`- Carb: ${ingredient['Ingredient Carb']}`);
            console.log(`- Fat: ${ingredient['Ingredient Fat']}`);
            console.log(`- Fiber: ${ingredient['Ingredient Fiber']}`);
        });

        console.log('\nFood Advice:', JSON.stringify(result.foodData.foodAdvice, null, 2));
        console.log('\nFood Preparation:', JSON.stringify(result.foodData.foodPreparation, null, 2));

        console.log('\n✅ Text Analysis Test Completed Successfully');
    } catch (error) {
        console.error('❌ Error testing text analysis:', error);
    }
}

// Execute tests
(async () => {
    try {
        await testTextAnalysis();
    } catch (error) {
        console.error('Script execution error:', error);
    }
})();
