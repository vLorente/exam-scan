#!/bin/bash

# 🐳 Script de Utilidades para Docker Compose
# Uso: ./scripts/docker.sh [comando]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}🐳 $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    log_error "Este script debe ejecutarse desde el directorio backend (donde está docker-compose.yml)"
    exit 1
fi

show_help() {
    echo "🐳 Script de Utilidades para Docker Compose"
    echo ""
    echo "Comandos disponibles:"
    echo "  dev-up      - Levantar entorno de desarrollo"
    echo "  dev-down    - Parar entorno de desarrollo"
    echo "  dev-logs    - Ver logs del entorno de desarrollo"
    echo "  dev-shell   - Abrir shell en el contenedor de desarrollo"
    echo ""
    echo "  prod-up     - Levantar entorno de producción"
    echo "  prod-down   - Parar entorno de producción"
    echo "  prod-logs   - Ver logs del entorno de producción"
    echo ""
    echo "  migrate     - Ejecutar migraciones en desarrollo"
    echo "  build       - Construir imagen"
    echo "  clean       - Limpiar contenedores e imágenes"
    echo "  status      - Ver estado de contenedores"
    echo "  help        - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./scripts/docker.sh dev-up     # Desarrollo con hot reload"
    echo "  ./scripts/docker.sh migrate    # Ejecutar migraciones"
    echo "  ./scripts/docker.sh prod-up    # Producción"
}

# Comandos de desarrollo
dev_up() {
    log_info "Levantando entorno de desarrollo..."
    docker-compose -f docker-compose.dev.yml up -d
    log_success "Entorno de desarrollo iniciado"
    echo ""
    log_info "Servicios disponibles:"
    echo "  - API: http://localhost:8000"
    echo "  - Docs: http://localhost:8000/docs"
    echo "  - PostgreSQL: localhost:5433"
    echo "  - Redis: localhost:6380"
    echo ""
    log_info "Ver logs: ./scripts/docker.sh dev-logs"
}

dev_down() {
    log_info "Parando entorno de desarrollo..."
    docker-compose -f docker-compose.dev.yml down
    log_success "Entorno de desarrollo parado"
}

dev_logs() {
    log_info "Mostrando logs del entorno de desarrollo..."
    docker-compose -f docker-compose.dev.yml logs -f
}

dev_shell() {
    log_info "Abriendo shell en el contenedor de desarrollo..."
    docker-compose -f docker-compose.dev.yml exec app-dev bash
}

# Comandos de producción
prod_up() {
    log_info "Levantando entorno de producción..."
    if [ ! -f ".env" ]; then
        log_warning "No se encontró archivo .env, creando uno básico..."
        echo "SECRET_KEY=$(openssl rand -base64 32)" > .env
        log_info "Archivo .env creado. Por favor, revisa y ajusta las variables según necesites."
    fi
    
    docker-compose up -d
    log_success "Entorno de producción iniciado"
    echo ""
    log_info "Servicios disponibles:"
    echo "  - API: http://localhost:8000"
    echo "  - Docs: http://localhost:8000/docs"
    echo "  - PostgreSQL: localhost:5432"
    echo "  - Redis: localhost:6379"
}

prod_down() {
    log_info "Parando entorno de producción..."
    docker-compose down
    log_success "Entorno de producción parado"
}

prod_logs() {
    log_info "Mostrando logs del entorno de producción..."
    docker-compose logs -f
}

# Comandos de utilidad
run_migrations() {
    log_info "Ejecutando migraciones en entorno de desarrollo..."
    docker-compose -f docker-compose.dev.yml --profile tools run --rm migrate
}

build_image() {
    log_info "Construyendo imagen de Docker..."
    docker-compose build
    log_success "Imagen construida exitosamente"
}

clean_docker() {
    log_warning "¡ATENCIÓN! Esto eliminará contenedores, imágenes y volúmenes no utilizados"
    echo "¿Continuar? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        log_info "Limpiando contenedores..."
        docker-compose down -v 2>/dev/null || true
        docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
        
        log_info "Limpiando imágenes no utilizadas..."
        docker system prune -f
        
        log_success "Limpieza completada"
    else
        log_info "Operación cancelada"
    fi
}

show_status() {
    log_info "Estado de contenedores..."
    echo ""
    echo "=== Entorno de Desarrollo ==="
    docker-compose -f docker-compose.dev.yml ps
    echo ""
    echo "=== Entorno de Producción ==="
    docker-compose ps
}

# Procesamiento de comandos
case "${1:-help}" in
    "dev-up")
        dev_up
        ;;
    "dev-down")
        dev_down
        ;;
    "dev-logs")
        dev_logs
        ;;
    "dev-shell")
        dev_shell
        ;;
    "prod-up")
        prod_up
        ;;
    "prod-down")
        prod_down
        ;;
    "prod-logs")
        prod_logs
        ;;
    "migrate")
        run_migrations
        ;;
    "build")
        build_image
        ;;
    "clean")
        clean_docker
        ;;
    "status")
        show_status
        ;;
    "help"|*)
        show_help
        ;;
esac
