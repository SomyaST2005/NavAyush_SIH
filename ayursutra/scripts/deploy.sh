#!/bin/bash

# AyurSutra Deployment Script

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_NAME="ayursutra"
DOCKER_IMAGE="ayursutra/backend"

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_dependencies() {
    log_info "Checking dependencies..."
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed."
        exit 1
    fi
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed."
        exit 1
    fi
    log_success "All dependencies are available"
}

install_dependencies() {
    log_info "Installing project dependencies..."
    npm install
    cd backend && npm install && cd ..
    cd frontend && npm install && cd ..
    log_success "Dependencies installed successfully"
}

build_frontend() {
    log_info "Building frontend application..."
    cd frontend && npm run build && cd ..
    log_success "Frontend built successfully"
}

deploy_local() {
    log_info "Deploying to local environment..."
    if [ ! -f .env ]; then
        log_warning ".env file not found. Copy .env.example to .env and configure it first."
        exit 1
    fi
    if command -v docker &> /dev/null; then
        docker-compose up -d
        log_success "Docker deployment completed. Running at http://localhost"
    else
        log_info "Docker not found. Starting with npm..."
        npm run dev
    fi
}

deploy_docker() {
    log_info "Deploying with Docker Compose..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed."
        exit 1
    fi
    docker-compose up --build -d
    sleep 30
    if docker-compose ps | grep -q "Up"; then
        log_success "Docker deployment completed. Running at http://localhost"
    else
        log_error "Some services failed to start. Check: docker-compose logs"
        exit 1
    fi
}

deploy_vercel() {
    log_info "Deploying to Vercel..."
    if ! command -v vercel &> /dev/null; then
        npm install -g vercel
    fi
    vercel --prod
    log_success "Vercel deployment completed"
}

cleanup() {
    log_info "Cleaning up..."
    rm -rf node_modules backend/node_modules frontend/node_modules frontend/build
    log_success "Cleanup completed"
}

show_help() {
    echo "AyurSutra Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install     Install project dependencies"
    echo "  build       Build frontend"
    echo "  local       Deploy locally (Docker Compose or npm dev)"
    echo "  docker      Deploy with Docker Compose"
    echo "  vercel      Deploy frontend to Vercel"
    echo "  cleanup     Clean up build artifacts"
    echo "  help        Show this help"
}

COMMAND="${1:-help}"

case $COMMAND in
    install)    check_dependencies && install_dependencies ;;
    build)      check_dependencies && build_frontend ;;
    local)      check_dependencies && install_dependencies && deploy_local ;;
    docker)     deploy_docker ;;
    vercel)     deploy_vercel ;;
    cleanup)    cleanup ;;
    help|*)     show_help ;;
esac
