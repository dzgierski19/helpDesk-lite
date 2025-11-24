FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build production bundle (expects API_URL or BACKEND_URL env at build time)
RUN npm run vercel-build

# Serve static files with SPA fallback (dist/frontend/browser)
RUN npm install -g serve
ENV PORT=3000
CMD ["sh", "-c", "serve -s dist/frontend/browser -l ${PORT:-3000}"]
