/**
 * Script to create a test food record for the admin user
 * 
 * Run with: node scripts/create-admin-food-record.js
 */

const { db } = require('../config/firebase');
const User = require('../models/user');
const MealType = require('../models/mealType');
const FoodRecord = require('../models/foodRecord');
const ImageProcessingService = require('../services/uploadService');

// Sample base64 image (this is just a very small placeholder)
const sampleBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

async function createAdminFoodRecord() {
    try {
        console.log('Fetching admin user...');
        const adminUser = await User.findByEmail('admin@gmail.com');

        if (!adminUser) {
            console.error('Admin user not found! Please run create-admin-user.js first.');
            process.exit(1);
        }

        console.log('Fetching meal types...');
        const mealTypes = await MealType.findAll();

        if (mealTypes.length === 0) {
            console.error('No meal types found! Please run create-meal-types.js first.');
            process.exit(1);
        }

        // Use breakfast meal type for the sample record
        const breakfastMealType = mealTypes.find(meal => meal.name.toLowerCase() === 'breakfast');

        if (!breakfastMealType) {
            console.error('Breakfast meal type not found!');
            process.exit(1);
        }

        console.log('Processing sample image...');
        const processingResults = await ImageProcessingService.processImage(sampleBase64Image);

        console.log('Creating sample food record for admin...');

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

        // Create food record data
        const foodRecordData = {
            userId: adminUser.id,
            mealTypeId: breakfastMealType.id,
            date: today,
            mealName: 'Sample Breakfast',
            description: 'A sample breakfast food record created for testing',
            image: {
                base64Data: sampleBase64Image,
                foodData: processingResults.foodData,
                processed: true,
                processingTimestamp: processingResults.timestamp
            },
            nutritionData: processingResults.nutritionData
        };

        // Save food record to database
        const savedRecord = await FoodRecord.save(foodRecordData);

        console.log('Sample food record created successfully:', savedRecord.id);
        console.log('Food record details:', {
            mealName: savedRecord.mealName,
            date: savedRecord.date,
            nutritionData: savedRecord.nutritionData
        });

        console.log('✅ Process completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin food record:', error);
        process.exit(1);
    }
}

// Execute the function
createAdminFoodRecord();
