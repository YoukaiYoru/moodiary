const { config } = require('../config/config');

const COOKIE_NAME = 'moodiary_session';

function serializeSessionCookie(rawToken, maxAge) {
  return `${COOKIE_NAME}=${encodeURIComponent(rawToken)}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=${config.authCookieSameSite}${config.authCookieSecure ? '; Secure' : ''}`;
}

function serializeClearedSessionCookie() {
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=${config.authCookieSameSite}${config.authCookieSecure ? '; Secure' : ''}`;
}

module.exports = { COOKIE_NAME, serializeSessionCookie, serializeClearedSessionCookie };
