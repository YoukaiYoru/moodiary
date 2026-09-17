const express = require('express');
const moodEntriesRouter = require('./moodEntries.router');
const userProfileRouter = require('./userProfile.router');
const moodEntryTagsRouter = require('./moodEntryTags.router');
const moodTypesRouter = require('./moodTypes.router');
const motivationalQuotesRouter = require('./motivationalQuotes.router');
const tagsRouter = require('./tags.router');
const userDailyQuotesRouter = require('./userDailyQuotes.router');
const { ensureUserProfile } = require('../middlewares/auth.handler');
const { requireLocalAuth } = require('../middlewares/local-auth.handler');
const authRouter = require('./auth.router');
const { requireAdmin } = require('../middlewares/security.handler');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/auth', authRouter);

  // Rutas públicas
  router.use('/moodTypes', moodTypesRouter); // Lectura pública; escritura administrativa
  router.use('/motivationalQuotes', motivationalQuotesRouter); // Lectura pública; escritura administrativa
  router.use('/tags', tagsRouter); // Lectura pública; escritura administrativa
  // Rutas protegidas (requieren autenticación)
  router.use('/moods', requireLocalAuth, ensureUserProfile, moodEntriesRouter); // Protegida
  router.use('/profile', requireLocalAuth, ensureUserProfile, userProfileRouter); // Protegida
  router.use('/moodEntryTags', requireLocalAuth, ensureUserProfile, moodEntryTagsRouter); // Protegida
  router.use('/userDailyQuotes', requireLocalAuth, ensureUserProfile, userDailyQuotesRouter); // Protegida
  // Aquí puedes agregar más rutas
}

module.exports = routerApi;
