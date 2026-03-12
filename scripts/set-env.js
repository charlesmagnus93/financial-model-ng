const fs = require('fs');
const path = require('path');

const apiBaseUrl = process.env.API_BASE_URL || 'https://api.example.com';
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';

const output = `export const environment = {
  production: true,
  apiBaseUrl: ${JSON.stringify(apiBaseUrl)},
  googleClientId: ${JSON.stringify(googleClientId)},
};
`;

const targetPath = path.join(__dirname, '..', 'src', 'environments', 'environment.production.ts');
fs.writeFileSync(targetPath, output);
