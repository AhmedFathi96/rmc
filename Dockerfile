# Stage 1: Builder
FROM node:20-slim AS builder

WORKDIR /app

# Install all dependencies, including development dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN yarn build

# Stage 2: Runner
FROM node:20-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

# Copy files from builder
COPY --from=builder /app /app

# Install production dependencies
RUN yarn install --production

# Define default command for production
CMD sh -c "npx wait-on tcp:postgres:5432 tcp:redis:6379 && \
    npx prisma migrate deploy && \
    node dist/prisma/seed.js && \
    node dist/src/index.js"

# Expose the application port
EXPOSE 3000
