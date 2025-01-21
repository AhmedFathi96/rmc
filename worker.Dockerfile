# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /worker

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the files
COPY . .

# Build the worker
RUN yarn build

# Stage 2: Runner
FROM node:20-alpine

WORKDIR /worker

# Install dependencies
RUN apk add --no-cache libc6-compat openssl curl

# Copy files from builder
COPY --from=builder /worker /worker

# Install production dependencies
RUN yarn install --production

# Copy the built files
COPY --from=builder /worker/dist /worker/dist

# Run database migrations and start the worker
CMD sh -c "npx wait-on tcp:postgres:5432 tcp:redis:6379 && \
    npx prisma migrate deploy && \
    node dist/worker.js"
