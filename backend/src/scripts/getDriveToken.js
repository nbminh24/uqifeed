const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Load client secrets
const CREDENTIALS_PATH = path.join(__dirname, '../services/client_secret_435706255487-1c8chl56sjhf8oett9q2un9fj4ea.apps.googleusercontent.com.json');
const TOKEN_PATH = path.join(__dirname, '../services/drive_token.json');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const code = await new Promise((resolve) => {
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            resolve(code);
        });
    });

    const { tokens } = await oAuth2Client.getToken(code);
    return tokens;
}

async function main() {
    try {
        const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
        const { client_id, client_secret, redirect_uris } = credentials.installed;

        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        );

        const token = await getAccessToken(oAuth2Client);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to:', TOKEN_PATH);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
