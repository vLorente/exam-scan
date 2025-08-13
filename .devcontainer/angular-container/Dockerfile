# Usa la imagen oficial de Node.js 20, la última versión LTS
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /workspace

# (Opcional pero buena práctica) Da permisos de escritura al usuario 'node'
# Esto asegura que el usuario no-root pueda escribir en el directorio
RUN chown -R node:node /workspace

# Habilita Corepack como 'root' para que pueda modificar la configuración del sistema
USER root
RUN corepack enable

# Prepara y activa pnpm como el gestor de paquetes por defecto
# Esto asegura que pnpm se use incluso si no hay una clave 'packageManager'
RUN corepack prepare pnpm@latest --activate

# Vuelve a cambiar al usuario no-root para el resto de las operaciones
USER node

# Expon el puerto por defecto de Angular
EXPOSE 4200

# El comando de inicio será gestionado por docker-compose
CMD ["/bin/bash"]