const Profile = require('../models/profile');
const TargetNutrition = require('../models/targetNutrition');
const NutritionCalculator = require('../services/nutritionCalculator');
const User = require('../models/user');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function calculateAdminNutrition() {
    try {
        // Find admin user
        const admin = await User.findByEmail('admin@gmail.com');

        if (!admin) {
            console.log('Admin user not found. Please create admin user first.');
            process.exit(1);
            return;
        }

        console.log('Found admin user:', admin.id);

        // Find admin profile
        const profile = await Profile.findByUserId(admin.id);

        if (!profile) {
            console.log('Admin profile not found. Please create admin profile first.');
            process.exit(1);
            return;
        }

        console.log('Found admin profile:', profile.id);

        // Calculate nutrition targets
        const nutritionTargets = NutritionCalculator.calculateNutritionTargets(profile);

        // Store nutrition targets
        const nutritionData = {
            userId: admin.id,
            profileId: profile.id,
            daily: nutritionTargets.daily,
            meals: nutritionTargets.meals,
            calculations: nutritionTargets.calculations
        };

        // Check if admin already has nutrition targets
        const existingNutrition = await TargetNutrition.findByUserId(admin.id);

        let nutrition;
        if (existingNutrition) {
            console.log('Admin nutrition targets already exist. Updating...');
            nutrition = await TargetNutrition.update(existingNutrition.id, nutritionData);
        } else {
            console.log('Creating new admin nutrition targets...');
            nutrition = await TargetNutrition.create(nutritionData);
        }

        console.log('Admin nutrition targets calculated successfully:');
        console.log({
            id: nutrition.id,
            userId: nutrition.userId,
            profileId: nutrition.profileId,
            daily: nutrition.daily,
            meals: nutrition.meals,
            calculations: nutrition.calculations,
            createdAt: nutrition.createdAt,
            updatedAt: nutrition.updatedAt
        });

        process.exit(0);
    } catch (error) {
        console.error('Error calculating admin nutrition:', error);
        process.exit(1);
    }
}

// Run the function
calculateAdminNutrition();
