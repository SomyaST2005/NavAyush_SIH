#!/bin/bash

# AyurSutra Deployment Script
# This script handles deployment to various environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ayursutra"
DOCKER_IMAGE="ayursutra/backend"
FRONTEND_BUILD_DIR="frontend/build"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    log_success "All dependencies are available"
}

install_dependencies() {
    log_info "Installing project dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install backend dependencies
    cd backend && npm install && cd ..
    
    # Install frontend dependencies
    cd frontend && npm install && cd ..
    
    log_success "Dependencies installed successfully"
}

build_frontend() {
    log_info "Building frontend application..."
    
    cd frontend
    npm run build
    cd ..
    
    log_success "Frontend built successfully"
}

build_docker_image() {
    log_info "Building Docker image..."
    
    # Build the Docker image
    docker build -t $DOCKER_IMAGE:latest .
    
    # Tag with version if provided
    if [ ! -z "$VERSION" ]; then
        docker tag $DOCKER_IMAGE:latest $DOCKER_IMAGE:$VERSION
        log_info "Tagged image as $DOCKER_IMAGE:$VERSION"
    fi
    
    log_success "Docker image built successfully"
}

deploy_local() {
    log_info "Deploying to local environment..."
    
    # Copy environment file
    if [ ! -f .env ]; then
        cp .env.example .env
        log_warning "Created .env file from .env.example. Please update with your configuration."
    fi
    
    # Start services with Docker Compose
    docker-compose up -d
    
    log_success "Local deployment completed. Application is running at http://localhost"
}

deploy_docker() {
    log_info "Deploying with Docker Compose..."
    
    # Build and start services
    docker-compose up --build -d
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        log_success "Docker deployment completed successfully"
        log_info "Application is running at http://localhost"
        log_info "API is available at http://localhost/api"
    else
        log_error "Some services failed to start. Check logs with: docker-compose logs"
        exit 1
    fi
}

deploy_kubernetes() {
    log_info "Deploying to Kubernetes..."
    
    # Check if kubectl is available
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    # Apply Kubernetes manifests
    kubectl apply -f kubernetes/namespace.yaml
    kubectl apply -f kubernetes/configmap.yaml
    kubectl apply -f kubernetes/secrets.yaml
    kubectl apply -f kubernetes/postgres.yaml
    kubectl apply -f kubernetes/redis.yaml
    kubectl apply -f kubernetes/deployment.yaml
    kubectl apply -f kubernetes/ingress.yaml
    
    # Wait for deployment to be ready
    log_info "Waiting for deployment to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/ayursutra-backend -n ayursutra
    
    log_success "Kubernetes deployment completed successfully"
}

deploy_heroku() {
    log_info "Deploying to Heroku..."
    
    # Check if Heroku CLI is available
    if ! command -v heroku &> /dev/null; then
        log_error "Heroku CLI is not installed. Please install Heroku CLI first."
        exit 1
    fi
    
    # Login to Heroku (if not already logged in)
    heroku auth:whoami || heroku login
    
    # Create Heroku app if it doesn't exist
    if ! heroku apps:info $PROJECT_NAME &> /dev/null; then
        heroku create $PROJECT_NAME
        log_info "Created Heroku app: $PROJECT_NAME"
    fi
    
    # Set stack to container
    heroku stack:set container -a $PROJECT_NAME
    
    # Deploy to Heroku
    git push heroku main
    
    log_success "Heroku deployment completed successfully"
    log_info "Application is available at: https://$PROJECT_NAME.herokuapp.com"
}

deploy_netlify() {
    log_info "Deploying frontend to Netlify..."
    
    # Build frontend
    build_frontend
    
    # Check if Netlify CLI is available
    if ! command -v netlify &> /dev/null; then
        log_warning "Netlify CLI is not installed. Installing..."
        npm install -g netlify-cli
    fi
    
    # Deploy to Netlify
    cd frontend
    netlify deploy --prod --dir=build
    cd ..
    
    log_success "Netlify deployment completed successfully"
}

deploy_vercel() {
    log_info "Deploying frontend to Vercel..."
    
    # Check if Vercel CLI is available
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    log_success "Vercel deployment completed successfully"
}

run_tests() {
    log_info "Running tests..."
    
    # Run backend tests
    cd backend && npm test && cd ..
    
    # Run frontend tests
    cd frontend && npm test -- --coverage --watchAll=false && cd ..
    
    log_success "All tests passed"
}

cleanup() {
    log_info "Cleaning up..."
    
    # Remove node_modules and build directories
    rm -rf node_modules
    rm -rf backend/node_modules
    rm -rf frontend/node_modules
    rm -rf frontend/build
    
    # Remove Docker images (optional)
    if [ "$CLEAN_DOCKER" = "true" ]; then
        docker rmi $DOCKER_IMAGE:latest || true
        docker system prune -f
    fi
    
    log_success "Cleanup completed"
}

show_help() {
    echo "AyurSutra Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  install     Install project dependencies"
    echo "  build       Build frontend and Docker image"
    echo "  test        Run all tests"
    echo "  local       Deploy to local environment"
    echo "  docker      Deploy with Docker Compose"
    echo "  k8s         Deploy to Kubernetes"
    echo "  heroku      Deploy to Heroku"
    echo "  netlify     Deploy frontend to Netlify"
    echo "  vercel      Deploy frontend to Vercel"
    echo "  cleanup     Clean up build artifacts"
    echo "  help        Show this help message"
    echo ""
    echo "Options:"
    echo "  --version=VERSION    Tag Docker image with version"
    echo "  --clean-docker       Remove Docker images during cleanup"
    echo "  --skip-tests         Skip running tests"
    echo ""
    echo "Examples:"
    echo "  $0 install"
    echo "  $0 build --version=1.0.0"
    echo "  $0 docker"
    echo "  $0 k8s"
    echo "  $0 cleanup --clean-docker"
}

# Parse command line arguments
COMMAND=""
VERSION=""
CLEAN_DOCKER="false"
SKIP_TESTS="false"

while [[ $# -gt 0 ]]; do
    case $1 in
        install|build|test|local|docker|k8s|heroku|netlify|vercel|cleanup|help)
            COMMAND="$1"
            shift
            ;;
        --version=*)
            VERSION="${1#*=}"
            shift
            ;;
        --clean-docker)
            CLEAN_DOCKER="true"
            shift
            ;;
        --skip-tests)
            SKIP_TESTS="true"
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
case $COMMAND in
    install)
        check_dependencies
        install_dependencies
        ;;
    build)
        check_dependencies
        build_frontend
        build_docker_image
        ;;
    test)
        check_dependencies
        run_tests
        ;;
    local)
        check_dependencies
        install_dependencies
        build_frontend
        deploy_local
        ;;
    docker)
        check_dependencies
        if [ "$SKIP_TESTS" != "true" ]; then
            run_tests
        fi
        build_frontend
        deploy_docker
        ;;
    k8s)
        check_dependencies
        if [ "$SKIP_TESTS" != "true" ]; then
            run_tests
        fi
        build_frontend
        build_docker_image
        deploy_kubernetes
        ;;
    heroku)
        check_dependencies
        if [ "$SKIP_TESTS" != "true" ]; then
            run_tests
        fi
        deploy_heroku
        ;;
    netlify)
        check_dependencies
        if [ "$SKIP_TESTS" != "true" ]; then
            run_tests
        fi
        deploy_netlify
        ;;
    vercel)
        check_dependencies
        if [ "$SKIP_TESTS" != "true" ]; then
            run_tests
        fi
        deploy_vercel
        ;;
    cleanup)
        cleanup
        ;;
    help|"")
        show_help
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        show_help
        exit 1
        ;;
esac
