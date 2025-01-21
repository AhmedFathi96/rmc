# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /worker

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the worker code
RUN yarn build

# Stage 2: Runner
FROM node:20-alpine

WORKDIR /worker

# Install dependencies for production
RUN apk add --no-cache libc6-compat openssl curl

# Copy only the necessary files from the builder stage
COPY --from=builder /worker/dist /worker/dist
COPY --from=builder /worker/package.json /worker/package.json
COPY --from=builder /worker/node_modules /worker/node_modules

# Set the default command to run the worker
CMD ["node", "dist/src/worker.js"]
