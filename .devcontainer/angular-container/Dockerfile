# Usa la imagen oficial de Node.js 22, la última versión LTS
FROM node:22-alpine

# Instala las dependencias del sistema necesarias (Alpine usa apk)
RUN apk add --no-cache bash curl git

# Establece el directorio de trabajo
WORKDIR /app/frontend

# Instala npm y el Angular CLI de forma global como root
USER root
RUN npm install -g npm@latest && npm install -g @angular/cli@latest

# Da permisos de escritura al usuario 'node' sobre el directorio /app
RUN chown -R node:node /app/frontend

# Vuelve a cambiar al usuario 'node' para el resto de las operaciones
USER node

# Expon el puerto por defecto de Angular
EXPOSE 4200

# El comando de inicio será gestionado por docker-compose
CMD ["/bin/bash"]