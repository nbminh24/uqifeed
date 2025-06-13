const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Firebase credentials from environment variables
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// Initialize Firebase admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Enable ignoring undefined values
    ignoreUndefinedProperties: true
});

// Get Firestore database
const db = admin.firestore();

// Get Firebase Auth
const auth = admin.auth();

// Initialize Firebase Storage conditionally (if bucket name is provided)
let storage = null;
let bucket = null;

if (process.env.FIREBASE_STORAGE_BUCKET) {
    storage = admin.storage();
    bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
}

module.exports = {
    admin,
    db,
    auth,
    storage,
    bucket
};
