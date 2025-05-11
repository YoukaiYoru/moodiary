const express = require('express');

const moodRouter = require('./mood.router');
const profileRouter = require('./profile.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/moods', moodRouter);
  router.use('/profile', profileRouter);
  // Aquí puedes agregar más rutas
}

module.exports = routerApi;
