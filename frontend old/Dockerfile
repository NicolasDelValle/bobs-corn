# ===========================
# Frontend Dockerfile
# Vite + React + TypeScript
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

# Install all dependencies
RUN npm install

# Copy application code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Development command with host binding for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ===========================
# Build stage
# ===========================
FROM base AS build

# Install all dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# ===========================
# Production stage (Nginx)
# ===========================
FROM nginx:alpine AS production

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
