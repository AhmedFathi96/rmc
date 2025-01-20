FROM node:20-alpine AS builder

# Set working directory
WORKDIR /worker

# Install build dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the worker files
COPY . .

# Build the worker
RUN yarn build

# Final stage: Runner
FROM node:20-alpine

# Set working directory
WORKDIR /worker

# Copy the built worker from the builder stage
COPY --from=builder /worker /worker

# Install production dependencies only
RUN yarn install --production

# Start the worker
CMD ["node", "dist/worker.js"]
