# /server/Dockerfile

# Usar la imagen oficial de Node
FROM node:18

# Crear un directorio para el servidor
WORKDIR /app

# Copiar archivos de configuración y dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . ./

# Exponer el puerto de la API
EXPOSE 5001

# Iniciar el servidor
CMD ["node", "index.js"]
