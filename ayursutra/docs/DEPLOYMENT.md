# AyurSutra Deployment Guide

This guide covers various deployment options for the AyurSutra Panchakarma Management System, from local development to production environments.

## 📋 Prerequisites

### System Requirements
- **CPU**: 2+ cores recommended
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 20GB minimum
- **OS**: Linux (Ubuntu 20.04+), macOS, or Windows with WSL2

### Software Dependencies
- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0
- **PostgreSQL**: >= 13
- **Redis**: >= 6.0
- **Docker**: >= 20.10 (for containerized deployment)
- **Kubernetes**: >= 1.20 (for K8s deployment)

## 🚀 Quick Deployment

### Using Deployment Script

The easiest way to deploy AyurSutra is using our automated deployment script:

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Local development
./scripts/deploy.sh local

# Docker deployment
./scripts/deploy.sh docker

# Kubernetes deployment
./scripts/deploy.sh k8s

# Cloud platforms
./scripts/deploy.sh heroku
./scripts/deploy.sh netlify
./scripts/deploy.sh vercel
```

## 🏠 Local Development

### 1. Environment Setup

```bash
# Clone repository
git clone https://github.com/ayursutra/panchakarma-system.git
cd ayursutra

# Install dependencies
npm run install-deps

# Setup environment
cp .env.example .env
# Edit .env with your configuration
```

### 2. Database Setup

```bash
# Start PostgreSQL and Redis
# On macOS with Homebrew:
brew services start postgresql
brew services start redis

# On Ubuntu:
sudo systemctl start postgresql
sudo systemctl start redis

# Create database and run migrations
cd backend
npm run migrate
npm run seed
cd ..
```

### 3. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run server  # Backend only
npm run client  # Frontend only
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api/docs

## 🐳 Docker Deployment

### Single Container Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Multi-Container Production Setup

```bash
# Production deployment with all services
docker-compose -f docker-compose.prod.yml up -d

# Scale backend instances
docker-compose up -d --scale backend=3
```

### Docker Configuration

The `docker-compose.yml` includes:
- **PostgreSQL**: Database with persistent storage
- **Redis**: Caching and session storage
- **Backend**: Node.js API server
- **AI Service**: Python-based AI microservice
- **Nginx**: Reverse proxy and load balancer

### Environment Variables for Docker

```bash
# Create production environment file
cp .env.example .env.production

# Required variables for Docker deployment
DB_HOST=postgres
REDIS_HOST=redis
AI_SERVICE_URL=http://ai-service:8000
```

## ☸️ Kubernetes Deployment

### 1. Cluster Setup

```bash
# Ensure kubectl is configured
kubectl cluster-info

# Create namespace
kubectl apply -f kubernetes/namespace.yaml
```

### 2. Secrets and ConfigMaps

```bash
# Update secrets with your values
kubectl apply -f kubernetes/secrets.yaml
kubectl apply -f kubernetes/configmap.yaml
```

### 3. Deploy Services

```bash
# Deploy database services
kubectl apply -f kubernetes/postgres.yaml
kubectl apply -f kubernetes/redis.yaml

# Deploy application
kubectl apply -f kubernetes/deployment.yaml

# Setup ingress
kubectl apply -f kubernetes/ingress.yaml
```

### 4. Verify Deployment

```bash
# Check pod status
kubectl get pods -n ayursutra

# Check services
kubectl get services -n ayursutra

# View logs
kubectl logs -f deployment/ayursutra-backend -n ayursutra
```

### Kubernetes Features

- **High Availability**: Multiple replicas with load balancing
- **Auto-scaling**: Horizontal pod autoscaling based on CPU/memory
- **Rolling Updates**: Zero-downtime deployments
- **Health Checks**: Liveness and readiness probes
- **Persistent Storage**: StatefulSets for database persistence
- **SSL Termination**: Automatic HTTPS with cert-manager

## ☁️ Cloud Platform Deployment

### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create ayursutra-app

# Set stack to container
heroku stack:set container

# Add PostgreSQL and Redis
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET_KEY=your_secret_key

# Deploy
git push heroku main
```

### Netlify Deployment (Frontend Only)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build frontend
cd frontend && npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Vercel Deployment (Frontend Only)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from root directory
vercel --prod
```

### AWS Deployment

#### Using AWS ECS

```bash
# Build and push Docker image
docker build -t ayursutra:latest .
docker tag ayursutra:latest your-account.dkr.ecr.region.amazonaws.com/ayursutra:latest
docker push your-account.dkr.ecr.region.amazonaws.com/ayursutra:latest

# Deploy using ECS task definition
aws ecs update-service --cluster ayursutra-cluster --service ayursutra-service
```

#### Using AWS EKS

```bash
# Configure kubectl for EKS
aws eks update-kubeconfig --region us-west-2 --name ayursutra-cluster

# Deploy using Kubernetes manifests
kubectl apply -f kubernetes/
```

## 🔧 Production Configuration

### Environment Variables

```bash
# Production environment variables
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/ayursutra_db
REDIS_URL=redis://host:6379

# Security
JWT_SECRET_KEY=your_super_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# External Services
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# AI Service
AI_SERVICE_URL=https://ai.ayursutra.com
AI_SERVICE_API_KEY=your_ai_api_key
```

### SSL/TLS Configuration

#### Using Let's Encrypt with Nginx

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d ayursutra.com -d www.ayursutra.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Using cert-manager in Kubernetes

```yaml
# Install cert-manager
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.8.0/cert-manager.yaml

# Create ClusterIssuer
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@ayursutra.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

### Database Configuration

#### PostgreSQL Production Settings

```sql
-- Create production database
CREATE DATABASE ayursutra_prod;
CREATE USER ayursutra_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ayursutra_prod TO ayursutra_user;

-- Performance tuning
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
```

#### Redis Configuration

```bash
# Redis production config
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

## 📊 Monitoring and Logging

### Application Monitoring

```bash
# Health check endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/health/detailed
```

### Logging Configuration

```javascript
// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### Prometheus Metrics

```javascript
// Add to backend/middleware/metrics.js
const promClient = require('prom-client');

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});
```

## 🔒 Security Configuration

### Firewall Rules

```bash
# UFW configuration for Ubuntu
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 5432/tcp   # PostgreSQL (internal only)
sudo ufw deny 6379/tcp   # Redis (internal only)
sudo ufw enable
```

### Nginx Security Headers

```nginx
# Security headers in nginx.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### Database Security

```sql
-- Create read-only user for reporting
CREATE USER ayursutra_readonly WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE ayursutra_prod TO ayursutra_readonly;
GRANT USAGE ON SCHEMA public TO ayursutra_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ayursutra_readonly;
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Kubernetes
        run: |
          echo ${{ secrets.KUBE_CONFIG }} | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig
          kubectl apply -f kubernetes/
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm ci
    - npm test

build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/ayursutra-backend ayursutra-backend=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main
```

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U postgres -d ayursutra_db

# View logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log
```

#### Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis

# Test connection
redis-cli ping

# View logs
sudo tail -f /var/log/redis/redis-server.log
```

#### Docker Issues
```bash
# Check container status
docker ps -a

# View container logs
docker logs ayursutra-backend

# Restart services
docker-compose restart

# Clean up
docker system prune -a
```

#### Kubernetes Issues
```bash
# Check pod status
kubectl get pods -n ayursutra

# Describe pod for details
kubectl describe pod <pod-name> -n ayursutra

# View logs
kubectl logs <pod-name> -n ayursutra

# Check events
kubectl get events -n ayursutra --sort-by='.lastTimestamp'
```

### Performance Issues

#### Database Optimization
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM appointments WHERE scheduled_date = '2024-01-20';

-- Create indexes
CREATE INDEX idx_appointments_scheduled_date ON appointments(scheduled_date);
CREATE INDEX idx_patients_user_id ON patients(user_id);
```

#### Redis Optimization
```bash
# Monitor Redis performance
redis-cli --latency-history -i 1

# Check memory usage
redis-cli info memory

# Optimize configuration
redis-cli config set maxmemory-policy allkeys-lru
```

## 📈 Scaling

### Horizontal Scaling

#### Load Balancing with Nginx
```nginx
upstream ayursutra_backend {
    least_conn;
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}
```

#### Kubernetes Horizontal Pod Autoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ayursutra-backend-hpa
  namespace: ayursutra
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ayursutra-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Database Scaling

#### Read Replicas
```bash
# PostgreSQL streaming replication
# On master server
wal_level = replica
max_wal_senders = 3
wal_keep_segments = 64

# On replica server
standby_mode = 'on'
primary_conninfo = 'host=master_ip port=5432 user=replicator'
```

#### Connection Pooling
```javascript
// PgBouncer configuration
const pool = new Pool({
  host: 'localhost',
  port: 6432, // PgBouncer port
  database: 'ayursutra_db',
  user: 'ayursutra_user',
  password: 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## 🔐 Backup and Recovery

### Database Backup
```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="ayursutra_backup_$DATE.sql"

pg_dump -h localhost -U postgres ayursutra_db > $BACKUP_DIR/$BACKUP_FILE
gzip $BACKUP_DIR/$BACKUP_FILE

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
```

### Redis Backup
```bash
# Redis backup
redis-cli BGSAVE
cp /var/lib/redis/dump.rdb /backups/redis/dump_$(date +%Y%m%d).rdb
```

### Application Data Backup
```bash
# Backup uploaded files
tar -czf /backups/uploads_$(date +%Y%m%d).tar.gz /app/uploads/

# Backup logs
tar -czf /backups/logs_$(date +%Y%m%d).tar.gz /app/logs/
```

## 📞 Support

For deployment support:
- **Email**: devops@ayursutra.com
- **Documentation**: https://docs.ayursutra.com/deployment
- **Discord**: [AyurSutra Community](https://discord.gg/ayursutra)
- **Status Page**: https://status.ayursutra.com
