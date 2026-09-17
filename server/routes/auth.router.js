const express = require('express');
const { config } = require('../config/config');
const { register, login, revokeSession, getUserFromSession, publicUser } = require('../services/auth.service');
const { getSessionToken } = require('../middlewares/local-auth.handler');

const router = express.Router();
const cookieName = 'moodiary_session';
const sameSite = config.authCookieSameSite;
const secure = config.isProd || config.authCookieSecure;

function setSessionCookie(res, session) {
  res.setHeader('Set-Cookie', `${cookieName}=${encodeURIComponent(session.rawToken)}; Max-Age=${session.maxAge}; Path=/; HttpOnly; SameSite=${sameSite}${secure ? '; Secure' : ''}`);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${cookieName}=; Max-Age=0; Path=/; HttpOnly; SameSite=${sameSite}${secure ? '; Secure' : ''}`);
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
