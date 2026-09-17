#!/bin/sh
set -eu

echo "Aplicando migraciones..."
npx sequelize-cli db:migrate

echo "Iniciando Moodiary API..."
exec node index.js
