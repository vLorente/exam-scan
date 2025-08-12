# Usa la imagen oficial de Python 3.12, la última versión estable
FROM python:3.12-slim

# Instala las dependencias del sistema necesarias
RUN apt-get update && apt-get install -y curl

# Crea un usuario no-root llamado 'pythonuser'
RUN adduser --disabled-password --gecos '' pythonuser

# Instala uv, el gestor de paquetes
RUN pip install uv

# Establece el directorio de trabajo
WORKDIR /app

# Da permisos de escritura al nuevo usuario sobre el directorio /app
RUN chown -R pythonuser:pythonuser /app

# Cambia al nuevo usuario para el resto de las operaciones
USER pythonuser

# El comando de inicio será gestionado por docker-compose
CMD ["/bin/bash"]