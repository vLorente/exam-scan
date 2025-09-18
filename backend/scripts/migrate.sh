#!/bin/bash

# 🗄️ Script de Utilidades para Migraciones Alembic
# Uso: ./scripts/migrate.sh [comando]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de utilidad
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
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
if [ ! -f "alembic.ini" ]; then
    log_error "Este script debe ejecutarse desde el directorio backend (donde está alembic.ini)"
    exit 1
fi

# Función para mostrar ayuda
show_help() {
    echo "🗄️ Script de Utilidades para Migraciones Alembic"
    echo ""
    echo "Comandos disponibles:"
    echo "  status     - Ver estado actual de migraciones"
    echo "  check      - Verificar si hay cambios pendientes"
    echo "  generate   - Generar nueva migración automáticamente"
    echo "  apply      - Aplicar todas las migraciones pendientes"
    echo "  history    - Ver historial de migraciones"
    echo "  rollback   - Retroceder una migración"
    echo "  help       - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./scripts/migrate.sh status"
    echo "  ./scripts/migrate.sh generate \"add user preferences\""
    echo "  ./scripts/migrate.sh apply"
}

# Función para verificar estado
check_status() {
    log_info "Verificando estado actual de migraciones..."
    echo ""
    
    log_info "Migración actual:"
    uv run alembic current
    echo ""
    
    log_info "Verificando cambios pendientes:"
    if uv run alembic check 2>/dev/null; then
        log_success "No hay cambios pendientes en los modelos"
    else
        log_warning "HAY CAMBIOS PENDIENTES - Se necesita generar una nueva migración"
        return 1
    fi
}

# Función para generar migración
generate_migration() {
    local message="$1"
    
    if [ -z "$message" ]; then
        echo "Ingrese una descripción para la migración:"
        read -r message
    fi
    
    if [ -z "$message" ]; then
        log_error "La descripción de la migración es obligatoria"
        exit 1
    fi
    
    log_info "Generando nueva migración: '$message'"
    
    # Verificar si hay cambios primero
    if uv run alembic check 2>/dev/null; then
        log_warning "No se detectaron cambios en los modelos"
        echo "¿Desea crear una migración vacía? (y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            uv run alembic revision -m "$message"
        else
            log_info "Operación cancelada"
            exit 0
        fi
    else
        uv run alembic revision --autogenerate -m "$message"
    fi
    
    log_success "Migración generada correctamente"
    
    # Mostrar archivo generado
    latest_migration=$(ls -t alembic/versions/*.py | head -n1)
    log_info "Archivo generado: $latest_migration"
    
    echo ""
    echo "¿Desea aplicar la migración ahora? (y/N)"
    read -r apply_now
    if [[ "$apply_now" =~ ^[Yy]$ ]]; then
        apply_migrations
    else
        log_info "Recuerde aplicar la migración con: ./scripts/migrate.sh apply"
    fi
}

# Función para aplicar migraciones
apply_migrations() {
    log_info "Aplicando migraciones..."
    
    # Verificar si hay migraciones pendientes
    current=$(uv run alembic current | grep -o '^[a-f0-9]*' || echo "")
    head=$(uv run alembic heads | grep -o '^[a-f0-9]*' || echo "")
    
    if [ "$current" = "$head" ]; then
        log_success "Ya estás en la última migración"
        return 0
    fi
    
    echo "Migraciones a aplicar:"
    uv run alembic show "$current:$head"
    echo ""
    
    echo "¿Continuar con la aplicación? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        uv run alembic upgrade head
        log_success "Migraciones aplicadas correctamente"
    else
        log_info "Operación cancelada"
    fi
}

# Función para mostrar historial
show_history() {
    log_info "Historial de migraciones:"
    echo ""
    uv run alembic history --verbose
}

# Función para retroceder
rollback_migration() {
    log_warning "¡ATENCIÓN! Vas a retroceder una migración"
    echo ""
    
    log_info "Migración actual:"
    uv run alembic current
    echo ""
    
    echo "¿Confirmas que quieres retroceder UNA migración? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        uv run alembic downgrade -1
        log_success "Migración revertida"
        
        log_info "Nueva migración actual:"
        uv run alembic current
    else
        log_info "Operación cancelada"
    fi
}

# Procesamiento de comandos
case "${1:-help}" in
    "status")
        check_status
        ;;
    "check")
        if check_status; then
            exit 0
        else
            exit 1
        fi
        ;;
    "generate")
        generate_migration "$2"
        ;;
    "apply")
        apply_migrations
        ;;
    "history")
        show_history
        ;;
    "rollback")
        rollback_migration
        ;;
    "help"|*)
        show_help
        ;;
esac
