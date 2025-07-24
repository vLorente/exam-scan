# Imagen base con Node.js
FROM node:lts-alpine AS build-stage

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila la aplicación Angular
RUN npm run build --prod

# Segunda etapa: servidor web ligero para servir la app
FROM nginx:alpine AS production-stage

# Copia los archivos generados por Angular al directorio de Nginx
COPY --from=build-stage /app/dist/* /usr/share/nginx/html

# Copia el archivo de configuración si lo tienes
# COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
