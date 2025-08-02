# 🚀 Scripts de Desarrollo

Esta carpeta contiene scripts de utilidad para facilitar el desarrollo del proyecto.

## 📝 Scripts Disponibles

### 🗄️ migrate.sh - Gestión de Migraciones
Script para gestionar migraciones de base de datos con Alembic.

```bash
# Ver estado actual
./scripts/migrate.sh status

# Verificar cambios pendientes
./scripts/migrate.sh check

# Generar nueva migración
./scripts/migrate.sh generate "descripción del cambio"

# Aplicar migraciones
./scripts/migrate.sh apply

# Ver historial
./scripts/migrate.sh history

# Retroceder una migración
./scripts/migrate.sh rollback

# Ver ayuda
./scripts/migrate.sh help
```

### 🐳 docker.sh - Gestión de Docker Compose
Script para gestionar entornos Docker de desarrollo y producción.

```bash
# Entorno de desarrollo (con hot reload)
./scripts/docker.sh dev-up      # Levantar desarrollo
./scripts/docker.sh dev-down    # Parar desarrollo
./scripts/docker.sh dev-logs    # Ver logs
./scripts/docker.sh dev-shell   # Shell en contenedor

# Entorno de producción
./scripts/docker.sh prod-up     # Levantar producción
./scripts/docker.sh prod-down   # Parar producción
./scripts/docker.sh prod-logs   # Ver logs

# Utilidades
./scripts/docker.sh migrate     # Ejecutar migraciones
./scripts/docker.sh build       # Construir imagen
./scripts/docker.sh clean       # Limpiar todo
./scripts/docker.sh status      # Ver estado
./scripts/docker.sh help        # Ver ayuda
```

### 🔧 docker-init.sh - Inicialización de Contenedor
Script interno que se ejecuta automáticamente al arrancar el contenedor:
- Espera a que PostgreSQL esté disponible
- Ejecuta migraciones automáticamente
- Verifica configuración
- Inicia la aplicación

### Ejemplos de Uso

#### Desarrollo con Docker:
```bash
# 1. Levantar entorno completo de desarrollo
./scripts/docker.sh dev-up

# 2. Verificar que todo funciona
curl http://localhost:8000/health

# 3. Ver documentación
open http://localhost:8000/docs

# 4. Modificar código (hot reload automático)
# 5. Si cambias modelos, ejecutar migraciones
./scripts/docker.sh migrate

# 6. Ver logs en tiempo real
./scripts/docker.sh dev-logs
```

#### Desarrollo local tradicional:
```bash
# 1. Verificar qué cambios hay
./scripts/migrate.sh check

# 2. Generar migración
./scripts/migrate.sh generate "add phone field to user model"

# 3. Aplicar migración
./scripts/migrate.sh apply
```

#### Flujo completo de desarrollo:
```bash
# Modificar modelos en app/models/
# Generar y aplicar migración
./scripts/migrate.sh generate "update user preferences"

# Ejecutar tests para verificar
uv run pytest

# Si todo está bien, commit
git add .
git commit -m "feat: add user preferences model with migration"
```

#### Producción:
```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con valores de producción

# 2. Levantar en producción
./scripts/docker.sh prod-up

# 3. Verificar estado
./scripts/docker.sh status

# 4. Ver logs
./scripts/docker.sh prod-logs
```

---

## � Configuración Docker

### Entornos Disponibles

#### 🔧 Desarrollo (`docker-compose.dev.yml`)
- **Hot reload** automático
- **PostgreSQL**: Puerto 5433 (para no conflictar)
- **Redis**: Puerto 6380
- **Bind mounts** para desarrollo
- **Migraciones automáticas** al iniciar

#### 🚀 Producción (`docker-compose.yml`)
- **Optimizado** para producción
- **Health checks** en todos los servicios
- **Volúmenes persistentes**
- **Reinicio automático**
- **Configuración vía variables de entorno**

### Variables de Entorno

Copia el archivo de ejemplo y personaliza:
```bash
cp .env.example .env
# Editar .env según tu entorno
```

### Características de Inicialización

El script `docker-init.sh` se ejecuta automáticamente y:
1. ✅ Verifica configuración
2. ⏳ Espera a que PostgreSQL esté listo
3. 🗄️ Ejecuta migraciones automáticamente
4. 🚀 Inicia la aplicación

### Puertos por Defecto

| Entorno | API | PostgreSQL | Redis |
|---------|-----|------------|-------|
| Desarrollo | 8000 | 5433 | 6380 |
| Producción | 8000 | 5432 | 6379 |

---

## 🔄 Integración con CI/CD

### Pre-commit Hook (opcional)
```bash
# En .git/hooks/pre-commit
#!/bin/bash
cd backend
if ! ./scripts/migrate.sh check; then
    echo "❌ Hay cambios en modelos sin migración correspondiente"
    echo "💡 Ejecuta: ./scripts/migrate.sh generate 'descripción'"
    exit 1
fi
```

### GitHub Actions
```yaml
# En .github/workflows/test.yml
- name: Check Migrations
  run: |
    cd backend
    ./scripts/migrate.sh check
```

---

## 📈 Próximas Mejoras

- [ ] Script para backup automático antes de migraciones
- [ ] Integración con Docker para migraciones en contenedores
- [ ] Validación automática de migraciones
- [ ] Script para rollback seguro con confirmaciones
