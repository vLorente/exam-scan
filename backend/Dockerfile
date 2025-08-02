FROM python:3.12-slim

# no escribir .pyc y output sin buffer
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# instalar dependencias del sistema
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# crear grupo y usuario sin privilegios
RUN addgroup --system appgroup \
    && adduser --system --ingroup appgroup --disabled-password --home /app appuser

WORKDIR /app

# copiar e instalar requerimientos con pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copiar el resto del código
COPY . .

# asegurar permisos correctos
RUN chown -R appuser:appgroup /app

# cambiar a usuario no root
USER appuser

# exponer puerto de la API
EXPOSE 8000

# comando por defecto para producción
# usa Gunicorn con Uvicorn workers
CMD ["fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]
