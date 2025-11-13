# ===========================
# Backend Dockerfile
# Node.js + TypeScript + Express + Prisma
# ===========================

# Base image
FROM node:22-alpine AS base
WORKDIR /app

# Copy package files
COPY package*.json ./

# ===========================
# Development stage
# ===========================
FROM base AS development

# Install all dependencies (including devDependencies)
RUN npm install

# Copy application code
COPY . .

# Set a dummy DATABASE_URL for Prisma Client generation
# The real DATABASE_URL will be provided at runtime via docker-compose
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Development command (use nodemon/tsx for hot reload)
CMD ["npx", "tsx", "watch", "src/index.ts"]

# ===========================
# Build stage
# ===========================
FROM base AS build

# Install all dependencies
RUN npm ci

# Copy application code
COPY . .

# Set a dummy DATABASE_URL for Prisma Client generation
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript to JavaScript
RUN npx tsc

# ===========================
# Production stage
# ===========================
FROM node:22-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/generated ./generated
COPY --from=build /app/prisma ./prisma

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Production command
CMD ["node", "dist/index.js"]
