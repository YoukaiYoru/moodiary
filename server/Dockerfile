# Usa una imagen base de Node
FROM node:20-bookworm-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos del backend
COPY package*.json ./

# Instala dependencias
RUN npm install

COPY . .
RUN chmod +x ./entrypoint.sh

# Expone el puerto que tu app usa (ajústalo si usas otro)
EXPOSE 5001

# Comando para ejecutar la app
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD node -e "const p=process.env.PORT||5001; fetch('http://127.0.0.1:'+p+'/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["./entrypoint.sh"]
