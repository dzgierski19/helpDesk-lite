const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');

const backend = (process.env.BACKEND_URL || '').replace(/\/$/, '');
const api = process.env.API_URL || (backend ? `${backend}/api` : '');

if (!api) {
  console.error('API_URL or BACKEND_URL must be set');
  process.exit(1);
}

const src = fs.readFileSync(envFile, 'utf8');
fs.writeFileSync(envFile, src.replace('%%API_URL%%', api));

console.log(`Set apiUrl to ${api}`);
