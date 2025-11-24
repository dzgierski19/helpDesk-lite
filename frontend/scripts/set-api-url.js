const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');

const backend = (process.env.BACKEND_URL || '').replace(/\/$/, '');
const api = process.env.API_URL || (backend ? `${backend}/api` : '/api');

const src = fs.readFileSync(envFile, 'utf8');
fs.writeFileSync(envFile, src.replace('%%API_URL%%', api));

console.log(`Set apiUrl to ${api}`);
