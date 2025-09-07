# Multi-stage build for AyurSutra Application
FROM node:18-alpine AS frontend-build

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source code
COPY frontend/ ./

# Build frontend application
RUN npm run build

# Backend stage
FROM node:18-alpine AS backend

# Install system dependencies
RUN apk add --no-cache \
    postgresql-client \
    curl \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S ayursutra -u 1001

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy backend source code
COPY backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/build ./public

# Create necessary directories
RUN mkdir -p logs uploads temp && \
    chown -R ayursutra:nodejs /app

# Switch to non-root user
USER ayursutra

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npm", "start"]
