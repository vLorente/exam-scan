FROM python:3.12-slim

# Variables de entorno para desarrollo
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instala dependencias del sistema
RUN apt-get update && apt-get install -y build-essential libpq-dev curl && rm -rf /var/lib/apt/lists/*

# Crea un usuario no root
RUN adduser --disabled-password --gecos "" appuser
USER appuser

# Establece directorio de trabajo
WORKDIR /app

# Copia e instala dependencias
COPY --chown=appuser:appuser requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY --chown=appuser:appuser . .

# Expone el puerto de la API
EXPOSE 8000

# Comando por defecto
CMD ["fastapi", "dev", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]
