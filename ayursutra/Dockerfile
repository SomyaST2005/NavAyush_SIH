# Multi-stage build for AyurSutra
# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production backend + serve frontend
FROM node:18-alpine
WORKDIR /app

# System deps for healthcheck + postgres migrations
RUN apk add --no-cache curl postgresql-client && rm -rf /var/cache/apk/*

# Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S ayursutra -u 1001

# Backend deps
COPY backend/package*.json ./
RUN npm ci --only=production

# Backend source
COPY backend/ ./

# Frontend build (served by Express as static)
COPY --from=frontend-build /app/frontend/build ./public

# Create writable dirs
RUN mkdir -p logs uploads temp && chown -R ayursutra:nodejs /app
USER ayursutra

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
