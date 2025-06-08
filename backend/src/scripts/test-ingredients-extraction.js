const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.join(__dirname, '../../.env');
dotenv.config({ path: envPath });

const GeminiService = require('../services/geminiService');

async function testIngredientsExtraction() {
    try {
        console.log('=== Testing Ingredients Extraction ===\n');

        const testText = "đậu hà lan, bông cải trắng, cải thảo, ớt chuông, cà chua mỗi loại 200gr xào với thịt bò 300gr, 2 chén cơm trắng";
        console.log('Test text:', testText);

        const geminiService = new GeminiService();
        const result = await geminiService.analyzeFoodText(testText);

        if (result && result.foodData) {
            const ingredients = result.foodData.foodIngredientList || [];
            console.log('\nExtracted ingredients:', ingredients.length);
            ingredients.forEach((ing, idx) => {
                console.log(`\n${idx + 1}. ${ing['Ingredient Name']}`);
                console.log(`   Amount: ${ing['Ingredient Amount']}`);
                console.log(`   Protein: ${ing['Ingredient Protein']}g`);
                console.log(`   Carbs: ${ing['Ingredient Carb']}g`);
                console.log(`   Fat: ${ing['Ingredient Fat']}g`);
                console.log(`   Fiber: ${ing['Ingredient Fiber']}g`);
            });
        }

        console.log('\n=== Test Complete ===');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test
testIngredientsExtraction();
