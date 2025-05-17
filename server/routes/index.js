const express = require('express');
const { requireAuth } = require('@clerk/express');
const redirectIfUnauthenticated = require('../middlewares/auth.handler');

const moodEntriesRouter = require('./moodEntries.router');
const userProfileRouter = require('./userProfile.router');
const moodEntryTagsRouter = require('./moodEntryTags.router');
const moodTypesRouter = require('./moodTypes.router');
const motivationalQuotesRouter = require('./motivationalQuotes.router');
const tagsRouter = require('./tags.router');
const userDailyQuotesRouter = require('./userDailyQuotes.router');
const webhookRouter = require('./webHook.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  // Rutas públicas
  router.use('/moodTypes', moodTypesRouter); // No protegida
  router.use('/motivationalQuotes', motivationalQuotesRouter); // No protegida
  router.use('/tags', tagsRouter); // No protegida
  router.use('/webhook', webhookRouter); // No protegida
  // Rutas protegidas (requieren autenticación)
  router.use(
    '/moods',
    redirectIfUnauthenticated(),
    requireAuth(),
    moodEntriesRouter,
  ); // Protegida
  router.use('/profile', requireAuth(), userProfileRouter); // Protegida
  router.use('/moodEntryTags', requireAuth(), moodEntryTagsRouter); // Protegida
  router.use('/userDailyQuotes', requireAuth(), userDailyQuotesRouter); // Protegida
  // Aquí puedes agregar más rutas
}

module.exports = routerApi;
