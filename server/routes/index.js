const express = require('express');
const { requireAuth } = require('@clerk/express');

const moodEntriesRouter = require('./moodEntries.router');
const userProfileRouter = require('./userProfile.router');
const moodEntryTagsRouter = require('./moodEntryTags.router');
const moodTypesRouter = require('./moodTypes.router');
const motivationalQuotesRouter = require('./motivationalQuotes.router');
const tagsRouter = require('./tags.router');
const userDailyQuotesRouter = require('./userDailyQuotes.router');
const { ensureUserProfile } = require('../middlewares/auth.handler');
const { requireAdmin } = require('../middlewares/security.handler');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  // Rutas públicas
  router.use('/moodTypes', moodTypesRouter); // Lectura pública; escritura administrativa
  router.use('/motivationalQuotes', motivationalQuotesRouter); // Lectura pública; escritura administrativa
  router.use('/tags', tagsRouter); // Lectura pública; escritura administrativa
  // Rutas protegidas (requieren autenticación)
  router.use('/moods', requireAuth(), ensureUserProfile, moodEntriesRouter); // Protegida
  router.use('/profile', requireAuth(), ensureUserProfile, userProfileRouter); // Protegida
  router.use('/moodEntryTags', requireAuth(), ensureUserProfile, moodEntryTagsRouter); // Protegida
  router.use('/userDailyQuotes', requireAuth(), ensureUserProfile, userDailyQuotesRouter); // Protegida
  // Aquí puedes agregar más rutas
}

module.exports = routerApi;
