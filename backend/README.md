# 🧠 Exam Scan - Backend

API desarrollada con **FastAPI** y **SQLModel** para gestionar exámenes tipo test, preguntas, sesiones y resultados, con autenticación JWT y PostgreSQL.

## 🎉 Estado del Proyecto

**🟢 Fase 1 y 2: COMPLETADAS** (Infraestructura + Autenticación)  
**🟡 Fase 3: 70% COMPLETADA** (CRUD + Lógica de Negocio)

### ✅ Funcionalidades Implementadas
- **Usuarios**: CRUD completo con validaciones (10 tests ✅)
- **Exámenes**: CRUD + lógica de negocio (publicar, archivar, estadísticas)
- **Preguntas/Opciones**: CRUD + validaciones avanzadas por tipo
- **Servicios**: ExamService, QuestionService, SessionService
- **Autenticación JWT**: Login/registro completo
- **Base de datos**: PostgreSQL con migraciones Alembic

---

## 🚀 Tecnologías

- **Python 3.12**
- **FastAPI**
- **SQLModel** + PostgreSQL
- **Pydantic Settings**
- **uv** (gestor de paquetes)
- **Docker & Dev Containers**
- **Alembic** (migraciones)
- **Passlib, python-jose** (seguridad)

---

## 📁 Estructura del Proyecto

```text
backend/
├── app/
│   ├── api/v1/
│   │   ├── routers/
│   │   │   ├── auth.py        ✅ Autenticación JWT
│   │   │   ├── users.py       ✅ CRUD usuarios
│   │   │   ├── exams.py       ✅ CRUD + lógica de negocio
│   │   │   ├── questions.py   ✅ CRUD preguntas/opciones
│   │   │   └── sessions.py    ⏳ Pendiente
│   │   └── api.py            # Router principal
│   ├── core/
│   │   ├── config.py         ✅ Configuración
│   │   ├── database.py       ✅ Conexión PostgreSQL
│   │   ├── security.py       ✅ JWT y hashing
│   │   └── exceptions.py     # Excepciones custom
│   ├── models/               ✅ Modelos SQLModel completos
│   │   ├── user.py          # Usuario con relaciones
│   │   ├── exam.py          # Examen con estados
│   │   ├── question.py      # Preguntas + opciones
│   │   ├── session.py       # Sesiones + respuestas
│   │   └── tag.py           # Tags para categorización
│   ├── services/             ✅ Lógica de negocio
│   │   ├── exam_service.py   # Validaciones y estadísticas
│   │   ├── question_service.py # Validaciones por tipo
│   │   └── session_service.py  # Gestión de sesiones
│   ├── tests/                ✅ Tests organizados
│   │   ├── test_users.py     # 10 tests ✅
│   │   ├── test_exams.py     # CRUD + services
│   │   ├── test_questions.py # CRUD + validaciones
│   │   ├── test_sessions.py  # Services
│   │   └── test_*.py         # 38+ tests base
│   └── main.py               ✅ FastAPI app
├── alembic/                  ✅ Migraciones DB
├── .env                      # Variables entorno
├── pyproject.toml           ✅ uv dependencies
└── README.md                # Este archivo
```

---

## ⚙️ Configuración

### Variables de entorno (`.env`)

```env
DATABASE_URL=postgresql+psycopg2://app_user:app_password@localhost:5432/app
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=["http://localhost:4200", "http://localhost:3000"]
```

---

## 🐳 Docker & Dev Containers

El proyecto incluye un `docker-compose.yml` que levanta:
- **app**: backend FastAPI
- **db**: PostgreSQL
- **redis**: (opcional)

Para desarrollo, asegúrate de exponer el puerto 5432 en el servicio `db`:

```yaml
  db:
    image: postgres:latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: app_password
```

---

## 🚀 Arranque Rápido

### 1. Configuración del entorno

Crear archivo `.env`:
```env
DATABASE_URL=postgresql+psycopg2://app_user:app_password@localhost:5432/app
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=["http://localhost:4200", "http://localhost:3000"]
```

### 2. Instalación y arranque

```bash
# En Dev Container (recomendado)
# VSCode → Dev Containers: Rebuild Container

# Instalar dependencias
uv sync

# Ejecutar migraciones
uv run alembic upgrade head

# Arrancar servidor de desarrollo
uv run fastapi dev app/main.py --reload
```

### 3. Acceso a la API

- **Documentación Swagger**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

---

## 📋 Endpoints Disponibles

### 🔐 Autenticación
- `POST /api/v1/auth/login` - Login con JWT
- `POST /api/v1/auth/register` - Registro de usuarios

### 👥 Usuarios
- `GET /api/v1/users/` - Listar usuarios
- `POST /api/v1/users/` - Crear usuario
- `GET /api/v1/users/{id}` - Obtener usuario
- `PUT /api/v1/users/{id}` - Actualizar usuario
- `DELETE /api/v1/users/{id}` - Eliminar usuario

### 📝 Exámenes
- `GET /api/v1/exams/` - Listar exámenes
- `POST /api/v1/exams/` - Crear examen
- `GET /api/v1/exams/{id}` - Obtener examen
- `PUT /api/v1/exams/{id}` - Actualizar examen
- `DELETE /api/v1/exams/{id}` - Eliminar examen

#### Lógica de Negocio
- `POST /api/v1/exams/{id}/publish` - Publicar examen
- `POST /api/v1/exams/{id}/archive` - Archivar examen
- `GET /api/v1/exams/{id}/validate` - Validar examen
- `GET /api/v1/exams/{id}/statistics` - Estadísticas

### ❓ Preguntas y Opciones
- `GET /api/v1/questions/` - Listar preguntas
- `POST /api/v1/questions/` - Crear pregunta
- `GET /api/v1/questions/{id}` - Obtener pregunta con opciones
- `PUT /api/v1/questions/{id}` - Actualizar pregunta
- `DELETE /api/v1/questions/{id}` - Eliminar pregunta

#### Opciones
- `GET /api/v1/questions/{id}/options` - Opciones de pregunta
- `POST /api/v1/questions/{id}/options` - Crear opción
- `PUT /api/v1/questions/options/{id}` - Actualizar opción
- `DELETE /api/v1/questions/options/{id}` - Eliminar opción

#### Validaciones Avanzadas
- `POST /api/v1/questions/{id}/validate` - Validar pregunta
- `POST /api/v1/questions/{id}/auto-fix` - Auto-corrección
- `GET /api/v1/questions/exam/{id}/validate-all` - Validar todas
- `POST /api/v1/questions/exam/{id}/reorder` - Reordenar preguntas

---

## 🏗️ Arquitectura del Sistema

### Patrón Híbrido: CRUD + Services

```text
🌐 API Layer (FastAPI Routers)
├── CRUD básico (GET, POST, PUT, DELETE)
└── Endpoints de lógica de negocio

🧠 Service Layer (Lógica de Negocio)
├── ExamService (validaciones, estadísticas)
├── QuestionService (validaciones por tipo)
└── SessionService (gestión de sesiones)

📄 Model Layer (SQLModel + PostgreSQL)
├── User (usuarios y relaciones)
├── Exam (exámenes con estados)
├── Question + Option (preguntas tipificadas)
└── ExamSession + StudentAnswer (sesiones)
```

### Tipos de Preguntas Soportadas
- **Multiple Choice**: Múltiples opciones, varias correctas
- **Single Choice**: Múltiples opciones, una correcta
- **True/False**: Verdadero o falso

### Estados de Examen
- **Draft**: Borrador (editable)
- **Published**: Publicado (disponible para estudiantes)
- **Archived**: Archivado (no disponible)

---

## 🧪 Testing

### Ejecutar Tests
```bash
# Todos los tests
uv run pytest

# Tests específicos
uv run pytest app/tests/test_users.py -v
uv run pytest app/tests/test_exams.py -v
uv run pytest app/tests/test_questions.py -v

# Con cobertura
uv run pytest --cov=app --cov-report=html
```

### Cobertura Actual
- **Usuarios**: 10/10 tests ✅
- **Exámenes**: CRUD + Services ✅  
- **Preguntas**: CRUD + Validaciones ✅
- **Sesiones**: Services ✅
- **Base**: 38+ tests de infraestructura ✅

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
uv run fastapi dev app/main.py --reload

# Migraciones
uv run alembic revision --autogenerate -m "descripción"
uv run alembic upgrade head

# Calidad de código
uv run black .
uv run isort .
uv run ruff check .

# Base de datos
uv run python -c "from app.core.database import create_tables; create_tables()"
```

---

## 🛠️ Troubleshooting

### Problemas de Base de Datos
- **Error de conexión**: Verificar `.env` y que PostgreSQL esté corriendo
- **Tablas no creadas**: Ejecutar `alembic upgrade head`
- **Puerto 5432 ocupado**: Cambiar puerto en `docker-compose.yml`

### Problemas de Dev Container
- **uv no encontrado**: Rebuild container
- **Puerto 8000 ocupado**: Cambiar puerto en launch settings

### Problemas de Tests
- **Tests fallan**: Verificar que la base de datos de tests funciona
- **Import errors**: Verificar PYTHONPATH y estructura de módulos

---

## 📈 Próximas Implementaciones

### Fase 3 (Completar)
- [ ] **Sessions CRUD**: Endpoints para gestión de sesiones
- [ ] **Tags CRUD**: Sistema de etiquetado y filtrado
- [ ] **Tests adicionales**: Completar cobertura de nuevos endpoints

### Fase 4 (Futuro)
- [ ] **Procesamiento PDF**: Subida y extracción de preguntas
- [ ] **IA Integration**: Extracción automática con LLM
- [ ] **Bulk Operations**: Importación masiva de preguntas

### Fase 5 (Monitorización)
- [ ] **Prometheus**: Métricas de rendimiento
- [ ] **Health Checks**: Endpoints de salud detallados
- [ ] **Logging**: Sistema de logs estructurado

---

## 📚 Documentación Adicional

- **Swagger UI**: `/docs` - Documentación interactiva
- **ReDoc**: `/redoc` - Documentación alternativa  
- **Esquemas**: `/openapi.json` - OpenAPI schema
- **Steps**: `steps.md` - Progreso detallado del desarrollo

---

## 🏆 Créditos

Desarrollado por **vLorente** con:
- FastAPI + SQLModel para APIs modernas
- PostgreSQL para persistencia robusta
- uv para gestión de dependencias rápida
- Dev Containers para desarrollo consistente

**Licencia**: MIT