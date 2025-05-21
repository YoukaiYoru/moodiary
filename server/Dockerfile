# Usa una imagen base de Node
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos del backend
COPY . .

# Instala dependencias
RUN npm install

# Expone el puerto que tu app usa (ajústalo si usas otro)
EXPOSE 5001

# Comando para ejecutar la app
CMD ["npm", "start"]
