const cloudinary = require('cloudinary').v2;

// Validate environment variables
function validateConfig() {
    const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required Cloudinary environment variables: ${missing.join(', ')}`);
    }
}

// Configure Cloudinary with validation
validateConfig();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Force HTTPS
});

// Test the configuration
cloudinary.config().cloud_name || console.error('Cloudinary configuration validation failed');

module.exports = cloudinary;
