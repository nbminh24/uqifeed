const { db } = require('../config/firebase');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Collection references
const oldCollection = db.collection('targetNutritions');
const newCollection = db.collection('target_nutrients');

async function migrateTargetNutrition() {
    try {
        console.log('Starting migration from targetNutritions to target_nutrients...');

        // Get all documents from old collection
        const snapshot = await oldCollection.get();

        if (snapshot.empty) {
            console.log('No target nutrition data found in old collection.');
            process.exit(0);
            return;
        }

        console.log(`Found ${snapshot.size} documents to migrate.`);

        // Migrate each document
        const migrationPromises = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`Migrating document ${doc.id}...`);

            // Add to new collection with same ID
            migrationPromises.push(
                newCollection.doc(doc.id).set(data)
                    .then(() => {
                        console.log(`Migrated document ${doc.id} successfully.`);
                        // Optionally delete from old collection
                        return oldCollection.doc(doc.id).delete();
                    })
                    .then(() => {
                        console.log(`Deleted document ${doc.id} from old collection.`);
                    })
            );
        });

        // Wait for all migrations to complete
        await Promise.all(migrationPromises);

        console.log('\nMigration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error migrating target nutrition data:', error);
        process.exit(1);
    }
}

// Run the function
migrateTargetNutrition();
