# =========================================
# Stage 1: Development - Angular Application
# =========================================

# Define the Node.js version to use (Alpine for a small footprint)
ARG NODE_VERSION=22.14.0-alpine

# Set the base image for development
FROM node:${NODE_VERSION} AS dev

# Install dependencies including Chromium for testing
RUN apk add --no-cache \
    bash \
    curl \
    git \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set environment variables for Chromium
ENV CHROME_BIN=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set environment variable to indicate development mode
ENV NODE_ENV=development

# Set the working directory to the root of the project
WORKDIR /app

# Copy only the frontend dependency files first to optimize Docker caching
COPY ./frontend/package.json ./frontend/package-lock.json ./frontend/

# Set working directory to frontend for npm install
WORKDIR /app/frontend

# Install dependencies using npm with caching to speed up subsequent builds
RUN --mount=type=cache,target=/root/.npm npm install

# Go back to root and copy all project files
WORKDIR /app
COPY . .

# Set working directory back to frontend for running the app
WORKDIR /app/frontend

# Expose the port Angular uses for the dev server (default is 4200)
EXPOSE 4200

# Start the Angular dev server and bind it to all network interfaces
CMD ["npm", "start", "--", "--host=0.0.0.0"]