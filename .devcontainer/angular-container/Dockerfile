# Usa la imagen oficial de Node.js 20, la última versión LTS
FROM node:20-alpine

# Instala las dependencias del sistema necesarias (Alpine usa apk)
RUN apk add --no-cache bash curl git

# Establece el directorio de trabajo
WORKDIR /app

# (Opcional pero buena práctica) Da permisos de escritura al usuario 'node'
# Esto asegura que el usuario no-root pueda escribir en el directorio
RUN chown -R node:node /app

# Habilita Corepack como 'root' para que pueda modificar la configuración del sistema
USER root
RUN corepack enable

# Prepara y activa pnpm como el gestor de paquetes por defecto
# Esto asegura que pnpm se use incluso si no hay una clave 'packageManager'
RUN corepack prepare pnpm@latest --activate

# Instalar el cli de angular
RUN npm install -g @angular/cli@latest

ENV SHELL=/bin/bash
USER node

# Expon el puerto por defecto de Angular
EXPOSE 4200

# El comando de inicio será gestionado por docker-compose
CMD ["/bin/bash"]