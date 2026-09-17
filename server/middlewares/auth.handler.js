const { getAuth, requireAuth } = require('@clerk/express');
const { models } = require('../libs/sequelize');

const clerkAuthMiddleware = requireAuth({
  unauthorizedHandler: (req, res) => {
    res.status(401).json({ error: 'No autorizado' });
  },
});

function redirectIfUnauthenticated(req, res, next) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.redirect(`https://deep-pipefish-84.accounts.dev/sign-in`);
    }

    next();
  } catch (error) {
    console.error('Clerk error:', error.message);
    res.status(401).send('Not authenticated');
  }
}

async function ensureUserProfile(req, res, next) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return next();

    await models.UserProfile.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
        display_name: userId,
        created_at: new Date(),
      },
    });

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  clerkAuthMiddleware,
  redirectIfUnauthenticated,
  ensureUserProfile,
};
