FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build production bundle (expects API_URL or BACKEND_URL env at build time)
RUN npm run vercel-build

# Serve static files
RUN npm install -g http-server
ENV PORT=3000
CMD ["sh", "-c", "http-server dist/frontend -p ${PORT} -a 0.0.0.0"]
