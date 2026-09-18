const express = require('express');
const { register, login, revokeSession, getUserFromSession, publicUser } = require('../services/auth.service');
const { getSessionToken } = require('../middlewares/local-auth.handler');
const { serializeSessionCookie, serializeClearedSessionCookie } = require('../lib/session-cookie');

const router = express.Router();
function setSessionCookie(res, session) {
  res.setHeader('Set-Cookie', serializeSessionCookie(session.rawToken, session.maxAge));
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', serializeClearedSessionCookie());
}

router.get('/me', async (req, res, next) => {
  try {
    const user = await getUserFromSession(getSessionToken(req));
    res.json({ user: user ? publicUser(user) : null });
  } catch (error) { next(error); }
});

router.post('/register', async (req, res, next) => {
  try {
    const result = await register(req.body || {});
    setSessionCookie(res, result.session);
    res.status(201).json({ user: result.user });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await login(req.body || {});
    setSessionCookie(res, result.session);
    res.json({ user: result.user });
  } catch (error) { next(error); }
});

router.post('/logout', async (req, res, next) => {
  try {
    await revokeSession(getSessionToken(req));
    clearSessionCookie(res);
    res.status(204).send();
  } catch (error) { next(error); }
});

module.exports = router;
