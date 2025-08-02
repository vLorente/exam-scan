# 🗄️ Guía de Migraciones de Base de Datos

## 📋 Estado Actual

### Configuración Alembic
- **Ubicación**: `/workspace/backend/alembic/`
- **Migración actual**: `4de3509c4210` (head)
- **Estado**: ✅ **Sincronizado** - No hay cambios pendientes

### Estructura de Migraciones
```
alembic/
├── versions/
│   ├── 1f12d83dbed3_initial_models_migration.py    # Migración inicial
│   └── 4de3509c4210_update_models_structure.py     # Última actualización
├── env.py          # Configuración del entorno
└── script.py.mako  # Template para nuevas migraciones
```

---

## 🔄 Flujo de Trabajo con Migraciones

### 1. **Verificar Estado Actual**
```bash
# Ver migración actual
uv run alembic current

# Verificar si hay cambios pendientes
uv run alembic check

# Ver historial de migraciones
uv run alembic history --verbose
```

### 2. **Después de Modificar Modelos**
```bash
# Generar migración automática
uv run alembic revision --autogenerate -m "descripción_del_cambio"

# Ejemplo específico
uv run alembic revision --autogenerate -m "add_user_preferences_table"
```

### 3. **Aplicar Migraciones**
```bash
# Aplicar todas las migraciones pendientes
uv run alembic upgrade head

# Aplicar migración específica
uv run alembic upgrade <revision_id>

# Retroceder una migración
uv run alembic downgrade -1
```

---

## 🛠️ Comandos Útiles

### Información y Estado
```bash
# Estado actual
uv run alembic current

# Verificar cambios pendientes
uv run alembic check

# Historial completo
uv run alembic history

# Ver SQL que se ejecutará
uv run alembic upgrade head --sql
```

### Gestión de Migraciones
```bash
# Crear migración vacía (manual)
uv run alembic revision -m "descripción"

# Generar migración automática
uv run alembic revision --autogenerate -m "descripción"

# Aplicar migraciones
uv run alembic upgrade head

# Retroceder migraciones
uv run alembic downgrade -1
uv run alembic downgrade base  # Retroceder todo
```

---

## 📝 Mejores Prácticas

### ✅ **QUÉ HACER**

1. **Siempre generar migración después de cambios en modelos**
   ```bash
   # Después de modificar app/models/*.py
   uv run alembic revision --autogenerate -m "update_user_model_add_phone"
   ```

2. **Usar nombres descriptivos**
   ```bash
   # ✅ Bien
   uv run alembic revision --autogenerate -m "add_exam_time_limit_field"
   
   # ❌ Mal
   uv run alembic revision --autogenerate -m "update"
   ```

3. **Revisar la migración antes de aplicarla**
   ```bash
   # Ver el archivo generado en alembic/versions/
   # Verificar que los cambios son correctos
   uv run alembic upgrade head
   ```

4. **Aplicar migraciones inmediatamente en desarrollo**
   ```bash
   uv run alembic upgrade head
   ```

### ❌ **QUÉ NO HACER**

1. **No editar migraciones ya aplicadas**
2. **No hacer cambios directos en la BD sin migración**
3. **No omitir la descripción en las migraciones**
4. **No aplicar migraciones sin revisarlas**

---

## 🔧 Configuración Actual

### env.py - Modelos Importados
```python
from app.models import (
    User, Exam, Question, Option, 
    ExamSession, StudentAnswer, Tag
)
```

### alembic.ini - Configuración
```ini
script_location = %(here)s/alembic
sqlalchemy.url = postgresql+psycopg2://app_user:app_password@db:5432/app
```

---

## 🚨 Escenarios Comunes

### Añadir Campo a Modelo Existente
```python
# En app/models/user.py
class User(UserBase, BaseModel, table=True):
    # ... campos existentes
    phone: Optional[str] = Field(default=None)  # 🆕 Nuevo campo
```

```bash
# Generar migración
uv run alembic revision --autogenerate -m "add_phone_field_to_user"

# Aplicar migración
uv run alembic upgrade head
```

### Crear Nueva Tabla
```python
# En app/models/notification.py
class Notification(BaseModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    message: str
```

```bash
# Actualizar app/models/__init__.py para incluir Notification
# Actualizar alembic/env.py para importar Notification

# Generar migración
uv run alembic revision --autogenerate -m "create_notification_table"

# Aplicar migración
uv run alembic upgrade head
```

### Modificar Tipo de Campo
```python
# Cambiar tipo de campo
class Exam(ExamBase, BaseModel, table=True):
    # Antes: duration_minutes: Optional[int] = ...
    duration_minutes: Optional[float] = ...  # 🔄 Cambio de tipo
```

```bash
# Generar migración (revisar cuidadosamente!)
uv run alembic revision --autogenerate -m "change_duration_to_float"

# Revisar migración generada antes de aplicar
uv run alembic upgrade head
```

---

## 📊 Monitoreo de Migraciones

### Verificación Regular
```bash
# Comando diario/semanal
uv run alembic check

# Si hay cambios pendientes
uv run alembic revision --autogenerate -m "sync_model_changes"
uv run alembic upgrade head
```

### En CI/CD Pipeline
```yaml
# En .github/workflows/
- name: Check DB Migrations
  run: |
    uv run alembic check
    uv run alembic upgrade head
```

---

## 🎯 Próximos Pasos

1. **Automatizar verificación**: Añadir hook pre-commit para verificar migraciones
2. **Scripts de utilidad**: Crear scripts para backup antes de migraciones
3. **Documentar migraciones**: Mantener changelog de cambios de esquema
4. **Testing**: Asegurar que tests pasan después de migraciones

---

**💡 Recuerda**: Cada cambio en `app/models/*.py` debe ir seguido de:
1. `uv run alembic revision --autogenerate -m "descripción"`
2. Revisar el archivo de migración generado
3. `uv run alembic upgrade head`
