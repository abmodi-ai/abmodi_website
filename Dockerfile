# Stage 1: Build the Vite application
FROM node:20-slim AS build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the Node.js server
FROM node:20-slim

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the built assets from the build-stage
COPY --from=build-stage /app/dist ./dist

# Copy the server file
COPY server.js ./

# Set environment variables (emails/secrets will be injected by Cloud Run)
ENV NODE_ENV=production
ENV PORT=8080

# Expose port 8080
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
