const { models } = require('../libs/sequelize');

function redirectIfUnauthenticated(req, res, next) {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).send('Not authenticated');
  }
}

async function ensureUserProfile(req, res, next) {
  try {
    const userId = req.auth?.userId;
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
  redirectIfUnauthenticated,
  ensureUserProfile,
};
