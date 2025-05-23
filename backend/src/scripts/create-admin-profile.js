const Profile = require('../models/profile');
const User = require('../models/user');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function createAdminProfile() {
    try {
        // Find admin user
        const admin = await User.findByEmail('admin@gmail.com');

        if (!admin) {
            console.log('Admin user not found. Please create admin user first.');
            process.exit(1);
            return;
        }

        console.log('Found admin user:', admin.id);

        // Check if profile already exists
        const existingProfile = await Profile.findByUserId(admin.id);
        if (existingProfile) {
            console.log('Admin profile already exists:', existingProfile.id);
            console.log(existingProfile);
            process.exit(0);
            return;
        }

        // Create profile data
        const profileData = {
            userId: admin.id,
            gender: 'Male',
            birthday: '1990-01-01',
            height: 175,
            currentWeight: 70,
            targetWeight: 65,
            targetTime: '2025-12-31',
            activityLevel: 'Moderately active',
            goal: 'Lose weight',
            dietType: 'Balanced'
        };

        // Create profile
        const profile = await Profile.create(profileData);

        console.log('Admin profile created successfully:');
        console.log({
            id: profile.id,
            userId: profile.userId,
            gender: profile.gender,
            birthday: profile.birthday,
            height: profile.height,
            currentWeight: profile.currentWeight,
            targetWeight: profile.targetWeight,
            targetTime: profile.targetTime,
            activityLevel: profile.activityLevel,
            goal: profile.goal,
            dietType: profile.dietType,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt
        });

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin profile:', error);
        process.exit(1);
    }
}

// Run the function
createAdminProfile();
