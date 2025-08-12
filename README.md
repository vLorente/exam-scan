# Estructura del Proyecto

``` text
exam_scan/
│
├── docker-compose.yml                # Orquestación de servicios para producción
├── README.md                         # Documentación general del proyecto
├── Requisitos.md                     # Documento de requisitos funcionales y técnicos
├── .devcontainer/                    # Configuración global de DevContainer (multi-servicio)
│   ├── .env.db                       # Variables de entorno para base de datos en desarrollo
│   ├── docker-compose.yml            # Compose para entorno de desarrollo global
│   ├── angular-container/            # Configuración personalizada para frontend Angular
│   └── python-container/             # Configuración personalizada para backend Python
├── backend/                          # Código fuente y configuración del backend (FastAPI)
│   ├── app/                          # Aplicación principal FastAPI
│   ├── alembic/                      # Migraciones de base de datos
│   ├── scripts/                      # Scripts auxiliares (migraciones, docker, init)
│   ├── .env                          # Variables de entorno
│   ├── alembic.ini                   # Configuración Alembic
│   ├── docker-compose.yml            # Compose para producción backend
│   ├── Dockerfile                    # Dockerfile para backend
│   ├── MIGRATIONS.md                 # Guía de migraciones
│   ├── pyproject.toml                # Dependencias Python (uv)
│   ├── pytest.ini                    # Configuración de tests
│   ├── README.md                     # Documentación backend
│   ├── steps.md                      # Pasos de implementación backend
│   ├── test_api.http                 # Pruebas HTTP manuales
│   └── uv.lock                       # Lockfile de dependencias Python
│
├── frontend/                         # Código fuente y configuración del frontend (Angular)
│   ├── src/                          # Código fuente Angular
│   ├── Dockerfile                    # Dockerfile para frontend
│   ├── angular.json                  # Configuración Angular CLI
│   └── README.md                     # Documentación frontend
│
├── grafana/                          # Configuración y dashboards de Grafana
├── prometheus/                       # Configuración de Prometheus
└── ...
```

