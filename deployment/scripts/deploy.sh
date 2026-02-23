#!/bin/bash
set -e

# BotMedia Deployment Script
# Usage: ./deploy.sh [start|stop|restart|status|logs|build]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/.."
COMPOSE_FILE="$DOCKER_DIR/docker-compose.prod.yml"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_env() {
    if [ ! -f "$DOCKER_DIR/.env" ]; then
        log_warn ".env file not found. Creating from template..."
        cat > "$DOCKER_DIR/.env" << 'EOF'
# Database
MYSQL_PASSWORD=your_secure_password

# JWT
JWT_SECRET=BotMedia2026SecretKeyForJwtTokenGeneration256Bits!

# RabbitMQ
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest

# WeChat Official Account
WECHAT_APP_ID=
WECHAT_APP_SECRET=
WECHAT_TOKEN=

# WeChat Pay
WECHAT_PAY_MCH_ID=
WECHAT_PAY_API_KEY=

# Alibaba Cloud OSS
ALIYUN_OSS_ENDPOINT=
ALIYUN_OSS_BUCKET=
ALIYUN_ACCESS_KEY_ID=
ALIYUN_ACCESS_KEY_SECRET=
EOF
        log_info ".env file created. Please update it with your credentials."
    fi
}

start() {
    log_info "Starting BotMedia services..."
    check_env
    docker-compose -f "$COMPOSE_FILE" --env-file "$DOCKER_DIR/.env" up -d
    log_info "Services started. Checking status..."
    sleep 5
    status
}

stop() {
    log_info "Stopping BotMedia services..."
    docker-compose -f "$COMPOSE_FILE" down
    log_info "All services stopped."
}

restart() {
    stop
    start
}

build() {
    log_info "Building BotMedia services..."
    check_env
    docker-compose -f "$COMPOSE_FILE" --env-file "$DOCKER_DIR/.env" build --no-cache
    log_info "Build complete."
}

status() {
    log_info "Service Status:"
    docker-compose -f "$COMPOSE_FILE" ps
}

logs() {
    SERVICE=${2:-""}
    if [ -n "$SERVICE" ]; then
        docker-compose -f "$COMPOSE_FILE" logs -f "$SERVICE"
    else
        docker-compose -f "$COMPOSE_FILE" logs -f --tail=100
    fi
}

backup_db() {
    log_info "Backing up databases..."
    BACKUP_DIR="$SCRIPT_DIR/backups"
    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    docker exec botmedia-mysql mysqldump -uroot -p"${MYSQL_PASSWORD:-root}" --all-databases > "$BACKUP_DIR/botmedia_backup_$TIMESTAMP.sql"
    log_info "Backup saved to $BACKUP_DIR/botmedia_backup_$TIMESTAMP.sql"
}

case "${1}" in
    start)   start ;;
    stop)    stop ;;
    restart) restart ;;
    build)   build ;;
    status)  status ;;
    logs)    logs "$@" ;;
    backup)  backup_db ;;
    *)
        echo "Usage: $0 {start|stop|restart|build|status|logs [service]|backup}"
        exit 1
        ;;
esac
