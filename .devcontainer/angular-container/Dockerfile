# Usa la imagen oficial de Node.js 20, la última versión LTS
FROM node:20-alpine

# Instala las dependencias del sistema necesarias (Alpine usa apk)
RUN apk add --no-cache bash curl git

# Establece el directorio de trabajo
WORKDIR /app/frontend

# (Opcional pero buena práctica) Da permisos de escritura al usuario 'node'
# Esto asegura que el usuario no-root pueda escribir en el directorio
RUN chown -R node:node /app

# Habilita Corepack y configura pnpm como por defecto (como root)
# Esto asegura que los comandos de pnpm se resuelvan correctamente.
USER root
RUN corepack enable && corepack prepare pnpm@latest --activate

# Instalar el cli de angular
RUN npm install -g @angular/cli@latest

ENV SHELL=/bin/bash
USER node

# Expon el puerto por defecto de Angular
EXPOSE 4200

# El comando de inicio será gestionado por docker-compose
CMD ["/bin/bash"]