# 🧠 Exam Scan - Backend

API desarrollada con **FastAPI** para procesar archivos PDF de exámenes tipo test, extraer preguntas mediante IA y gestionar un repositorio colaborativo de exámenes y resultados.

---

## 🚀 Tecnologías

- **Python 3.12**
- **FastAPI** [v0.113]
- **SQLAlchemy** + PostgreSQL
- **Pydantic Settings**
- **uv** (gestor de paquetes)
- **Docker & Dev Containers**
- (Opcional) OpenAI / PDF parsers (PyMuPDF, Tesseract, etc.)

---

## 📁 Estructura

```text
backend/
├── app/
│ ├── api/ # Endpoints y routers
│ ├── config/ # Configuración (entorno, settings)
│ ├── core/ # Seguridad, excepciones, logs
│ ├── db/ # Sesión, inicialización, base de datos
│ ├── models/ # Modelos SQLAlchemy
│ ├── schemas/ # Modelos Pydantic
│ ├── services/ # Lógica de negocio y procesamiento
│ └── main.py # Punto de entrada de FastAPI
├── .env
├── pyproject.toml
├── uv.lock
└── README.md
```

---

## ⚙️ Configuración

### Con uv (recomendado)

1. Instala uv si no lo tienes:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Instala las dependencias:
```bash
uv sync
```

3. Crea el archivo .env:
```env
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/exams
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=["http://localhost:4200"]
```

### Con pip tradicional (si prefieres)

```bash
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 🧪 Ejecutar en modo desarrollo

### Con uv:
```bash
uv run fastapi dev app/main.py --host 0.0.0.0 --port 8000
```

### Con pip tradicional:
```bash
fastapi dev app/main.py --host 0.0.0.0 --port 8000
```

---

## 🧪 Comandos útiles con uv

```bash
# Instalar dependencias
uv sync

# Agregar nueva dependencia
uv add nombre-paquete

# Agregar dependencia de desarrollo
uv add --dev pytest

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