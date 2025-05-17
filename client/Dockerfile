# Etapa de build
FROM node:18 AS build

WORKDIR /app

# Agrega esta línea para forzar legacy peer deps
ENV npm_config_legacy_peer_deps=true

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Etapa de producción
FROM node:20

WORKDIR /app

# Instala `serve` para servir la aplicación
RUN npm install -g serve

COPY --from=build /app/dist ./dist

CMD ["serve", "-s", "dist"]
