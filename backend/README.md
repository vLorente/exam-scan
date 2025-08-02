# 🧠 Exam Scan - Backend

API desarrollada con **FastAPI** y **SQLModel** para gestionar exámenes tipo test, preguntas, sesiones y resultados, con autenticación JWT y PostgreSQL.

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

## 📁 Estructura

```text
backend/
├── app/
│   ├── api/           # Endpoints y routers
│   ├── core/          # Configuración, seguridad, excepciones
│   ├── models/        # Modelos SQLModel
│   ├── services/      # Lógica de negocio
│   ├── main.py        # Punto de entrada FastAPI
│   └── ...
├── alembic/           # Migraciones
├── .env               # Variables de entorno
├── pyproject.toml     # Dependencias
├── uv.lock            # Lockfile uv
├── Dockerfile         # Devcontainer
├── README.md
└── ...
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

## 🧪 Arranque rápido

1. **Rebuild del devcontainer** (VSCode → Dev Containers: Rebuild)
2. **Configura tu `.env`** (ver ejemplo arriba)
3. **Instala dependencias**
   ```bash
   uv sync
   ```
4. **Arranca el backend**
   ```bash
   uv run fastapi dev app/main.py --reload
   ```
5. **Accede a la API**
   - Documentación Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠️ Troubleshooting

- Si ves `psycopg2.OperationalError: role "user" does not exist`, revisa tu `.env` y asegúrate de usar `app_user` y la base de datos `app`.
- Si no se crean las tablas, asegúrate de importar los modelos antes de llamar a `SQLModel.metadata.create_all(engine)`.
- Si el puerto 5432 no está accesible, revisa el mapeo de puertos en `docker-compose.yml` y haz rebuild del devcontainer.

---

## 📦 Endpoints principales (planificados)

- POST /api/v1/upload → Subir y procesar PDF
- GET /api/v1/questions → Listar preguntas
- GET /api/v1/exams → Consultar exámenes
- POST /api/v1/exams → Crear exámenes
- POST /api/v1/answer → Enviar respuestas
- POST /api/v1/auth/login → Login JWT
- POST /api/v1/auth/register → Registro de usuario

> La documentación Swagger estará disponible en `/docs` al levantar la API.

---

## 🧪 Comandos útiles con uv

```bash
# Instalar dependencias
uv sync

# Agregar nueva dependencia
uv add nombre-paquete

# Ejecutar scripts
uv run python script.py
uv run fastapi dev app/main.py

# Ejecutar tests
uv run pytest

# Formatear código
uv run black .
uv run isort .

# Linting
uv run ruff check .
```

---

## 📦 Endpoints principales (planificados)

- POST /api/v1/upload → Subir y procesar un PDF
- GET /api/v1/questions → Listar preguntas
- GET /api/v1/exams → Consultar exámenes
- POST /api/v1/exams → Crear exámenes manualmente
- POST /api/v1/answer → Enviar respuestas del alumno

> La documentación Swagger estará disponible en /docs al levantar la API.

---

## 🛠️ Dev Containers (VSCode)

Este backend está preparado para ejecutarse en Dev Containers con uv preinstalado. Solo abre la carpeta backend/ con VSCode y selecciona:

> Dev Containers: Reopen in Container

---

## 📚 Créditos y licencia

Desarrollado por vLorente. MIT License.