const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Initialize Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const CREDENTIALS_PATH = path.join(__dirname, '../../services/client_secret_435706255487-1c8chl56sjhf8oett9q2un9fj4ea.apps.googleusercontent.com.json');

class DriveService {
    constructor() {
        this.auth = null;
        this.drive = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
            const { client_id, client_secret, redirect_uris } = credentials.installed;

            const oAuth2Client = new google.auth.OAuth2(
                client_id,
                client_secret,
                redirect_uris[0]
            );

            // Use service account or saved tokens
            // For development, we can use saved tokens
            const TOKEN_PATH = path.join(__dirname, '../../services/drive_token.json');
            if (fs.existsSync(TOKEN_PATH)) {
                const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
                oAuth2Client.setCredentials(token);
            }

            this.auth = oAuth2Client;
            this.drive = google.drive({ version: 'v3', auth: this.auth });
            this.initialized = true;
        } catch (error) {
            console.error('Error initializing Drive service:', error);
            throw error;
        }
    }

    async uploadImage(base64Data, filename) {
        await this.initialize();

        try {
            // Remove data URI prefix if present
            const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Image, 'base64');

            // Upload file to Drive
            const response = await this.drive.files.create({
                requestBody: {
                    name: filename,
                    mimeType: 'image/jpeg',
                },
                media: {
                    mimeType: 'image/jpeg',
                    body: buffer
                }
            });

            // Make the file publicly accessible
            await this.drive.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });

            // Get public URL
            const publicUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;
            return publicUrl;
        } catch (error) {
            console.error('Error uploading to Drive:', error);
            throw error;
        }
    }
}

module.exports = new DriveService();
