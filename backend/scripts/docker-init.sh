#!/bin/bash

# 🚀 Script de Inicialización para Docker
# Este script se ejecuta cuando arranca el contenedor

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INIT]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[INIT]${NC} ✅ $1"
}

log_warning() {
    echo -e "${YELLOW}[INIT]${NC} ⚠️  $1"
}

log_error() {
    echo -e "${RED}[INIT]${NC} ❌ $1"
}

# Función para esperar a que PostgreSQL esté listo
wait_for_postgres() {
    log_info "Esperando a que PostgreSQL esté disponible..."
    
    # Extraer componentes de la URL de la base de datos
    if [ -z "$DATABASE_URL" ]; then
        log_error "DATABASE_URL no está configurada"
        exit 1
    fi
    
    # Usar pg_isready si está disponible, sino usar python
    if command -v pg_isready >/dev/null 2>&1; then
        while ! pg_isready -d "$DATABASE_URL" >/dev/null 2>&1; do
            log_info "PostgreSQL no está listo aún... esperando 2 segundos"
            sleep 2
        done
    else
        # Fallback usando python y psycopg2
        python3 -c "
import os
import time
import psycopg2
from urllib.parse import urlparse

max_retries = 30
retry_count = 0

while retry_count < max_retries:
    try:
        result = urlparse(os.environ['DATABASE_URL'])
        connection = psycopg2.connect(
            database=result.path[1:],
            user=result.username,
            password=result.password,
            host=result.hostname,
            port=result.port,
        )
        connection.close()
        print('PostgreSQL está listo!')
        break
    except psycopg2.OperationalError:
        retry_count += 1
        print(f'PostgreSQL no está listo aún... reintento {retry_count}/{max_retries}')
        time.sleep(2)
else:
    print('Error: No se pudo conectar a PostgreSQL después de 30 intentos')
    exit(1)
"
    fi
    
    log_success "PostgreSQL está listo!"
}

# Función para ejecutar migraciones
run_migrations() {
    log_info "Verificando y ejecutando migraciones..."
    
    # Verificar si hay migraciones pendientes
    if ! uv run alembic check >/dev/null 2>&1; then
        log_warning "Se detectaron cambios en los modelos sin migración"
        log_info "Ejecutando upgrade para aplicar migraciones existentes..."
    fi
    
    # Aplicar migraciones
    log_info "Aplicando migraciones de base de datos..."
    uv run alembic upgrade head
    
    log_success "Migraciones aplicadas correctamente"
}

# Función para verificar configuración
check_config() {
    log_info "Verificando configuración..."
    
    # Verificar variables de entorno críticas
    if [ -z "$DATABASE_URL" ]; then
        log_error "DATABASE_URL no está configurada"
        exit 1
    fi
    
    if [ -z "$SECRET_KEY" ]; then
        log_warning "SECRET_KEY no está configurada, usando valor por defecto (no recomendado para producción)"
    fi
    
    log_success "Configuración verificada"
}

# Función para crear tablas si no existen (primera vez)
create_tables_if_needed() {
    log_info "Verificando si las tablas existen..."
    
    # Intentar crear tablas usando SQLModel si no hay migraciones
    python3 -c "
try:
    from app.core.database import engine
    from sqlmodel import SQLModel
    from app.models import *  # Importar todos los modelos
    
    # Esto solo creará tablas si no existen
    SQLModel.metadata.create_all(engine)
    print('Tablas verificadas/creadas correctamente')
except Exception as e:
    print(f'Error al verificar tablas: {e}')
    # No es crítico, las migraciones se encargarán
"
    
    log_success "Verificación de tablas completada"
}

# Función principal
main() {
    log_info "🚀 Iniciando configuración del contenedor..."
    
    # 1. Verificar configuración
    check_config
    
    # 2. Esperar a PostgreSQL
    wait_for_postgres
    
    # 3. Crear tablas si es necesario (primera vez)
    create_tables_if_needed
    
    # 4. Ejecutar migraciones
    run_migrations
    
    log_success "🎉 Inicialización completada exitosamente!"
    
    # 5. Ejecutar el comando principal
    log_info "Iniciando aplicación: $*"
    exec "$@"
}

# Ejecutar función principal con todos los argumentos
main "$@"
