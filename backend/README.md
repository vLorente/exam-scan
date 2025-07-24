# 🧠 Exam Scan - Backend

API desarrollada con **FastAPI** para procesar archivos PDF de exámenes tipo test, extraer preguntas mediante IA y gestionar un repositorio colaborativo de exámenes y resultados.

---

## 🚀 Tecnologías

- **Python 3.12**
- **FastAPI** [v0.112]
- **SQLAlchemy** + PostgreSQL
- **Pydantic Settings**
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
├── requirements.txt
└── README.md
```


---

## ⚙️ Configuración

1. Crea y configura tu entorno virtual (si estás fuera de devcontainer):

```bash
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Crea el archivo .env:

```env
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/exams
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=["http://localhost:4200"]
```

---

## 🧪 Ejecutar en modo desarrollo

```bash
fastapi dev app/main.py --host 0.0.0.0 --port 8000
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

Este backend está preparado para ejecutarse en Dev Containers. Solo abre la carpeta backend/ con VSCode y selecciona:

> Dev Containers: Reopen in Container
