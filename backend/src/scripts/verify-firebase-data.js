/**
 * Script to verify Firebase Firestore connection and data
 * This script will:
 * 1. Test connection to Firestore
 * 2. Create test data
 * 3. Read test data
 * 4. Clean up test data
 */

require('dotenv').config();
const { db } = require('../config/firebase');

async function testFirebaseConnection() {
    try {
        console.log('=== TESTING FIREBASE FIRESTORE CONNECTION ===');
        console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);

        // Test collections existence
        const foodsCollection = db.collection('foods');
        const ingredientsCollection = db.collection('ingredients');

        console.log('\n--- Checking existing collections ---');
        const collections = await db.listCollections();
        console.log('Collections in database:');
        collections.forEach(collection => {
            console.log(`- ${collection.id}`);
        });

        // Create test document
        console.log('\n--- Creating test document ---');
        const testData = {
            test_name: 'Test Food',
            test_description: 'This is a test document to verify Firestore connection',
            timestamp: new Date().toISOString()
        };

        const docRef = await foodsCollection.add(testData);
        console.log(`Test document created with ID: ${docRef.id}`);

        // Read test document
        console.log('\n--- Reading test document ---');
        const docSnapshot = await docRef.get();

        if (docSnapshot.exists) {
            console.log('Test document data:');
            console.log(docSnapshot.data());
        } else {
            console.log('Test document does not exist');
        }

        // List existing documents in foods collection
        console.log('\n--- Listing documents in foods collection ---');
        const foodsSnapshot = await foodsCollection.get();

        if (foodsSnapshot.empty) {
            console.log('No documents found in foods collection');
        } else {
            console.log(`Found ${foodsSnapshot.size} documents in foods collection:`);
            foodsSnapshot.forEach(doc => {
                console.log(`- Document ID: ${doc.id}`);
                console.log(`  Food name: ${doc.data().food_name || doc.data().test_name || 'N/A'}`);
                console.log(`  Created at: ${doc.data().created_at || 'N/A'}`);
            });
        }

        // List existing documents in ingredients collection
        console.log('\n--- Listing documents in ingredients collection ---');
        const ingredientsSnapshot = await ingredientsCollection.get();

        if (ingredientsSnapshot.empty) {
            console.log('No documents found in ingredients collection');
        } else {
            console.log(`Found ${ingredientsSnapshot.size} documents in ingredients collection:`);
            ingredientsSnapshot.forEach(doc => {
                console.log(`- Document ID: ${doc.id}`);
                console.log(`  Ingredient name: ${doc.data().ingredient_name || 'N/A'}`);
                console.log(`  Food ID: ${doc.data().food_id || 'N/A'}`);
            });
        }

        // Delete test document
        console.log('\n--- Deleting test document ---');
        await docRef.delete();
        console.log('Test document deleted');

        console.log('\n=== FIREBASE CONNECTION TEST COMPLETED SUCCESSFULLY ===');
        console.log('If you can see test data and collection information above,');
        console.log('your Firebase connection is working correctly.');
        console.log('\nTo see your data in Firebase Console:');
        console.log(`1. Go to https://console.firebase.google.com/project/${process.env.FIREBASE_PROJECT_ID}/firestore/data/`);
        console.log('2. Check the "foods" and "ingredients" collections');

    } catch (error) {
        console.error('Error testing Firebase connection:', error);
    }
}

// Run the test
testFirebaseConnection();
