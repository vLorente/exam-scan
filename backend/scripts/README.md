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

### Ejemplos de Uso

#### Después de modificar un modelo:
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

---

## 🛡️ Buenas Prácticas

1. **Siempre verificar antes de aplicar**: Usar `./scripts/migrate.sh status` antes de hacer cambios
2. **Nombres descriptivos**: Usar descripciones claras en las migraciones
3. **Revisar archivos generados**: Verificar el contenido de la migración antes de aplicar
4. **Tests después de migración**: Ejecutar tests después de aplicar migraciones
5. **Backup en producción**: Siempre hacer backup antes de aplicar en producción

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
