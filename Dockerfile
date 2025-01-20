# Stage 1: Builder
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the app
RUN yarn build

RUN npx prisma generate

# Stage 2: Runner
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app /app

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Install production dependencies only
RUN yarn install --production

# Start the application
CMD ["node", "dist/index.js"]
