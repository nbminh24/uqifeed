// Mock data generator for food history
const { db } = require('./src/config/firebase');
const { startOfDay, endOfDay, addDays, subDays, format } = require('date-fns');

// Collection reference
const foodHistoryCollection = db.collection('food_history');

// User ID for mock data
const userId = 'mock_user_id';

// Generate mock food items
const generateMockFoodItems = (date, count = 3) => {
    const foods = [];
    const dateObj = new Date(date);
    const dateSeed = dateObj.getDate(); // 1-31

    // Breakfast
    foods.push({
        userId: userId,
        name: 'Breakfast - Oatmeal with fruits',
        mealTime: new Date(dateObj.setHours(8, 0, 0, 0)),
        mealType: 'breakfast',
        calories: Math.round(300 + (dateSeed * 5)),
        proteins: Math.round(10 + (dateSeed * 0.3)),
        fats: Math.round(5 + (dateSeed * 0.2)),
        carbs: Math.round(40 + (dateSeed * 0.5)),
        imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2F0bWVhbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        createdAt: new Date().toISOString()
    });

    // Lunch
    if (count >= 2) {
        foods.push({
            userId: userId,
            name: 'Lunch - Grilled chicken salad',
            mealTime: new Date(dateObj.setHours(13, 0, 0, 0)),
            mealType: 'lunch',
            calories: Math.round(450 + (dateSeed * 8)),
            proteins: Math.round(25 + (dateSeed * 0.5)),
            fats: Math.round(15 + (dateSeed * 0.3)),
            carbs: Math.round(30 + (dateSeed * 0.4)),
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
            createdAt: new Date().toISOString()
        });
    }

    // Dinner
    if (count >= 3) {
        foods.push({
            userId: userId,
            name: 'Dinner - Salmon with vegetables',
            mealTime: new Date(dateObj.setHours(19, 0, 0, 0)),
            mealType: 'dinner',
            calories: Math.round(500 + (dateSeed * 7)),
            proteins: Math.round(30 + (dateSeed * 0.6)),
            fats: Math.round(20 + (dateSeed * 0.4)),
            carbs: Math.round(25 + (dateSeed * 0.3)),
            imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlubmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
            createdAt: new Date().toISOString()
        });
    }

    // Snack
    if (count >= 4) {
        foods.push({
            userId: userId,
            name: 'Snack - Yogurt and berries',
            mealTime: new Date(dateObj.setHours(16, 0, 0, 0)),
            mealType: 'snack',
            calories: Math.round(150 + (dateSeed * 3)),
            proteins: Math.round(5 + (dateSeed * 0.2)),
            fats: Math.round(3 + (dateSeed * 0.1)),
            carbs: Math.round(20 + (dateSeed * 0.3)),
            imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9ndXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
            createdAt: new Date().toISOString()
        });
    }

    return foods;
};

// Generate and save mock data for a date range
const generateMockData = async (startDate, endDate) => {
    try {
        console.log(`Generating mock data from ${startDate} to ${endDate}`);

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Delete existing mock data for this date range and user
        const deleteQuery = await foodHistoryCollection
            .where('userId', '==', userId)
            .get();

        const batch = db.batch();

        deleteQuery.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Commit the delete batch
        await batch.commit();
        console.log(`Deleted existing mock data for user ${userId}`);

        // Generate new mock data
        let currentDate = start;
        let promises = [];

        while (currentDate <= end) {
            const dateStr = format(currentDate, 'yyyy-MM-dd');
            const foodItems = generateMockFoodItems(dateStr, Math.floor(Math.random() * 3) + 2); // 2-4 items per day

            console.log(`Generating ${foodItems.length} food items for ${dateStr}`);

            // Add each food item to Firestore
            foodItems.forEach(item => {
                promises.push(foodHistoryCollection.add(item));
            });

            // Move to next day
            currentDate = addDays(currentDate, 1);
        }

        await Promise.all(promises);
        console.log('Mock data generation completed successfully!');

    } catch (error) {
        console.error('Error generating mock data:', error);
    }
};

// Set date range for mock data
const today = new Date();
const startDate = subDays(today, 7); // 7 days ago
const endDate = today;

// Run the generator
generateMockData(startDate, endDate)
    .then(() => {
        console.log('Script completed');
        process.exit(0);
    })
    .catch(error => {
        console.error('Script failed:', error);
        process.exit(1);
    });
