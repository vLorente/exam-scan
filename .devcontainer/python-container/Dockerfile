# Usa la imagen oficial de Python 3.12, la última versión estable
FROM python:3.12-slim

# Instala las dependencias del sistema necesarias
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends curl postgresql-client git \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Instala el gestor de paquetes uv
RUN pip install uv

# Establece el directorio de trabajo
WORKDIR /app/backend

# Copia el archivo de dependencias y instala todos los paquetes
# Asumiendo que usas pyproject.toml
# Si usas requirements.txt, reemplaza las siguientes líneas con:
# COPY ../../backend/requirements.txt .
# RUN uv sync
COPY backend/pyproject.toml .

# Instala dependencias
RUN uv sync

# Crea un usuario no-root
RUN adduser --disabled-password --gecos '' pythonuser

# Da permisos de escritura al nuevo usuario
RUN chown -R pythonuser:pythonuser /app

# Cambia al nuevo usuario para el resto de las operaciones
USER pythonuser

# El comando de inicio será gestionado por docker-compose
CMD ["/bin/bash"]