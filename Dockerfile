# Stage 1: Build the React Application
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Vite React app
RUN npm run build

# Stage 2: Production Server
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Copy backend server code
COPY --from=builder /app/server ./server
COPY --from=builder /app/api ./api

# Set environment variables for production
ENV NODE_ENV=production
ENV RUN_LOCAL=true
# By default, server.js runs on PORT 5000 if not specified
ENV PORT=5000

# Expose the backend port
EXPOSE 5000

# Start the server
CMD ["npm", "run", "server"]
