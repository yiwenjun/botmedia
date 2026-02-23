#!/bin/bash
# BotMedia - Stop All Services Script

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
LOG_DIR="$PROJECT_ROOT/logs"
PID_FILE="$LOG_DIR/services.pid"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

log_info "Stopping all BotMedia services..."

# Stop Java services
if [ -f "$PID_FILE" ]; then
    while read pid; do
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            log_info "Stopping process $pid..."
            kill "$pid" 2>/dev/null || true
        fi
    done < "$PID_FILE"
    rm -f "$PID_FILE"
else
    # Find and kill by port
    for port in 8761 8888 8080 8081 8082 8083 8084 8085 8086 8087 8088; do
        pid=$(lsof -ti:$port 2>/dev/null || true)
        if [ -n "$pid" ]; then
            log_info "Stopping service on port $port (PID: $pid)..."
            kill $pid 2>/dev/null || true
        fi
    done
fi

# Stop Docker containers
log_info "Stopping Docker containers..."
cd "$PROJECT_ROOT/deployment"
docker-compose down 2>/dev/null || true

log_info "All services stopped."
