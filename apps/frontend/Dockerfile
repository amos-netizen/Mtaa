# Frontend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/frontend/package.json ./apps/frontend/
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

# Build Next.js application
WORKDIR /app/apps/frontend
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/frontend/next.config.js ./

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start application
CMD ["npm", "start"]



