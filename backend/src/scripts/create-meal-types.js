const MealType = require('../models/mealType');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Default meal types
const DEFAULT_MEAL_TYPES = [
    { name: 'Breakfast' },
    { name: 'Lunch' },
    { name: 'Dinner' },
    { name: 'Snacks' }
];

async function createMealTypes() {
    try {
        console.log('Creating default meal types...');

        for (const mealTypeData of DEFAULT_MEAL_TYPES) {
            // Check if meal type already exists
            const existingMealType = await MealType.findByName(mealTypeData.name);

            if (existingMealType) {
                console.log(`Meal type "${mealTypeData.name}" already exists:`, existingMealType.id);
            } else {
                // Create meal type
                const mealType = await MealType.create(mealTypeData);
                console.log(`Meal type "${mealTypeData.name}" created:`, mealType.id);
            }
        }

        // Get all meal types
        const allMealTypes = await MealType.findAll();
        console.log('\nAll meal types:', allMealTypes.map(type => ({
            id: type.id,
            name: type.name,
            createdAt: type.createdAt
        })));

        console.log('\nDefault meal types created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating meal types:', error);
        process.exit(1);
    }
}

// Run the function
createMealTypes();
