# Backend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/

# Install dependencies
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Copy source code
COPY . .

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "dist/main.js"]



