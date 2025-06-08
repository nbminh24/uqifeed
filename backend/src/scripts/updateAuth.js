/**
 * Script to replace auth middleware with mock auth in all route files
 */
const fs = require('fs');
const path = require('path');

// Route files directory
const routesDir = path.join(__dirname, '../routes');

// Read all files in routes directory
fs.readdir(routesDir, (err, files) => {
    if (err) {
        console.error('Error reading routes directory:', err);
        return;
    }

    // Process each .js file
    files.forEach(file => {
        if (path.extname(file) === '.js') {
            const filePath = path.join(routesDir, file);

            // Read file content
            let content = fs.readFileSync(filePath, 'utf8');

            // Replace auth middleware import with mock auth
            content = content.replace(
                /const \{ authenticate[^\}]*\} = require\(['"]\.\.\/middleware\/auth['"]\);/g,
                `const { authenticate } = require('../middleware/mockAuth');`
            );

            // Write back to file
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated:', file);
        }
    });

    console.log('All route files updated to use mock authentication');
});
