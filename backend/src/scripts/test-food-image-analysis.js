/**
 * Script to test food image analysis with Gemini API
 * 
 * Run with: node src/scripts/test-food-image-analysis.js
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

// Sample image path - using the path provided by the user
const sampleImagePath = "C:\\Users\\USER\\Downloads\\test.jpg";

// Function to convert file to base64
function fileToBase64(filePath) {
    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Convert buffer to base64 string
    const base64String = fileBuffer.toString('base64');

    // Get file MIME type based on extension
    const extension = path.extname(filePath).toLowerCase();
    let mimeType;

    switch (extension) {
        case '.jpg':
        case '.jpeg':
            mimeType = 'image/jpeg';
            break;
        case '.png':
            mimeType = 'image/png';
            break;
        case '.gif':
            mimeType = 'image/gif';
            break;
        default:
            mimeType = 'application/octet-stream';
    }

    // Return complete base64 data URL
    return `data:${mimeType};base64,${base64String}`;
}

async function testFoodImageAnalysis() {
    try {
        console.log('Converting image to base64...');

        // Check if test image exists
        if (!fs.existsSync(sampleImagePath)) {
            console.error(`Test image not found at: ${sampleImagePath}`);
            console.log('Please ensure the image exists at the specified path');
            return;
        }

        const base64Image = fileToBase64(sampleImagePath);
        console.log('Image converted to base64');

        console.log('Analyzing food image with Gemini API...');
        const result = await geminiService.analyzeFoodImage(base64Image);

        console.log('Analysis complete!');
        console.log('Food Data:');
        console.log(JSON.stringify(result.foodData, null, 2));

        // Save the result to a JSON file for reference
        const outputPath = path.join(__dirname, '../../test-results.json');
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log(`Result saved to: ${outputPath}`);

        console.log('✅ Test completed successfully!');
    } catch (error) {
        console.error('Error testing food image analysis:', error);
    }
}

// Execute the test
testFoodImageAnalysis();
