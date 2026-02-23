#!/bin/bash
# BotMedia - One-Click Startup Script
# Usage: ./start-all.sh [dev|prod]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
BACKEND_DIR="$PROJECT_ROOT/backend"
LOG_DIR="$PROJECT_ROOT/logs"
MODE="${1:-dev}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

# Create logs directory
mkdir -p "$LOG_DIR"

# PID file for tracking
PID_FILE="$LOG_DIR/services.pid"
> "$PID_FILE"

cleanup() {
    log_warn "Shutting down services..."
    if [ -f "$PID_FILE" ]; then
        while read pid; do
            if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
                kill "$pid" 2>/dev/null || true
            fi
        done < "$PID_FILE"
        rm -f "$PID_FILE"
    fi
    log_info "All services stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=${3:-30}
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            log_info "$name is ready!"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    log_error "$name failed to start after $max_attempts attempts"
    return 1
}

start_jar() {
    local name=$1
    local jar=$2
    local port=$3
    
    if [ ! -f "$jar" ]; then
        log_error "JAR not found: $jar"
        log_warn "Run 'mvn clean package -DskipTests' first"
        return 1
    fi
    
    log_step "Starting $name on port $port..."
    java -jar -Xms256m -Xmx512m "$jar" > "$LOG_DIR/$name.log" 2>&1 &
    local pid=$!
    echo "$pid" >> "$PID_FILE"
    log_info "$name started (PID: $pid)"
}

# ============================================
# MAIN
# ============================================

log_info "=========================================="
log_info "  BotMedia One-Click Startup"
log_info "  Mode: $MODE"
log_info "=========================================="

# Step 1: Start Infrastructure
log_step "Step 1: Starting infrastructure (MySQL, Redis, RabbitMQ)..."
cd "$PROJECT_ROOT/deployment"
docker-compose up -d mysql redis rabbitmq
log_info "Waiting for MySQL to be ready..."
sleep 10
wait_for_service "http://localhost:15672" "RabbitMQ" 15 || true

# Step 2: Start Eureka Server
log_step "Step 2: Starting Eureka Server..."
start_jar "eureka-server" "$BACKEND_DIR/eureka-server/target/eureka-server-1.0.0-SNAPSHOT.jar" 8761
wait_for_service "http://localhost:8761/actuator/health" "Eureka Server" 60

# Step 3: Start Config Server
log_step "Step 3: Starting Config Server..."
start_jar "config-server" "$BACKEND_DIR/config-server/target/config-server-1.0.0-SNAPSHOT.jar" 8888
wait_for_service "http://localhost:8888/actuator/health" "Config Server" 60

# Step 4: Start API Gateway
log_step "Step 4: Starting API Gateway..."
start_jar "api-gateway" "$BACKEND_DIR/api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar" 8080
sleep 5

# Step 5: Start Business Services
log_step "Step 5: Starting Business Services..."

start_jar "user-service" "$BACKEND_DIR/user-service/target/user-service-1.0.0-SNAPSHOT.jar" 8081
start_jar "content-service" "$BACKEND_DIR/content-service/target/content-service-1.0.0-SNAPSHOT.jar" 8082
start_jar "product-service" "$BACKEND_DIR/product-service/target/product-service-1.0.0-SNAPSHOT.jar" 8083
start_jar "wechat-service" "$BACKEND_DIR/wechat-service/target/wechat-service-1.0.0-SNAPSHOT.jar" 8084
start_jar "payment-service" "$BACKEND_DIR/payment-service/target/payment-service-1.0.0-SNAPSHOT.jar" 8085
start_jar "media-service" "$BACKEND_DIR/media-service/target/media-service-1.0.0-SNAPSHOT.jar" 8086
start_jar "analytics-service" "$BACKEND_DIR/analytics-service/target/analytics-service-1.0.0-SNAPSHOT.jar" 8087
start_jar "notification-service" "$BACKEND_DIR/notification-service/target/notification-service-1.0.0-SNAPSHOT.jar" 8088

# Wait for services to register
log_info "Waiting for services to register with Eureka..."
sleep 15

# Summary
log_info "=========================================="
log_info "  All Services Started!"
log_info "=========================================="
log_info ""
log_info "Service URLs:"
log_info "  Eureka Dashboard:  http://localhost:8761"
log_info "  API Gateway:       http://localhost:8080"
log_info "  RabbitMQ Console:  http://localhost:15672 (guest/guest)"
log_info ""
log_info "API Endpoints:"
log_info "  Users:    http://localhost:8080/api/v1/users"
log_info "  Articles: http://localhost:8080/api/v1/articles"
log_info "  Products: http://localhost:8080/api/v1/products"
log_info ""
log_info "Logs: $LOG_DIR/"
log_info ""
log_info "Press Ctrl+C to stop all services"
log_info "=========================================="

# Keep script running
while true; do
    sleep 60
    # Health check
    if ! curl -s "http://localhost:8761/actuator/health" > /dev/null 2>&1; then
        log_warn "Eureka Server health check failed"
    fi
done
