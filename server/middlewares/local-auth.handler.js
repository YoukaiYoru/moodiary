const { getUserFromSession } = require('../services/auth.service');

function getSessionToken(req) {
  const cookies = String(req.headers.cookie || '').split(';');
  const entry = cookies.find((cookie) => cookie.trim().startsWith('moodiary_session='));
  return entry ? decodeURIComponent(entry.trim().slice('moodiary_session='.length)) : null;
}

async function localAuthMiddleware(req, _res, next) {
  try {
    const user = await getUserFromSession(getSessionToken(req));
    req.auth = user ? { userId: user.user_id, user } : null;
    next();
  } catch (error) {
    next(error);
  }
}

function requireLocalAuth(req, res, next) {
  if (!req.auth?.userId) return res.status(401).json({ error: 'No autorizado' });
  next();
}

module.exports = { getSessionToken, localAuthMiddleware, requireLocalAuth };
