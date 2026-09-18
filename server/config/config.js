const path = require('node:path');
const dotenv = require('dotenv');

const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `../.env.${environment}`) });
dotenv.config();
const dns = require('node:dns');

function normalizeOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

// Selecciona la familia DNS usada por PostgreSQL: 4 (IPv4) o 6 (IPv6).
dns.setDefaultResultOrder(process.env.DB_IP_FAMILY === '6' ? 'ipv6first' : 'ipv4first');

const config = {
  env: environment,
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT || 5001),
  databaseUrl: process.env.DATABASE_URL,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  authCookieSameSite:
    process.env.AUTH_COOKIE_SAME_SITE || (environment === 'production' ? 'none' : 'lax'),
  authCookieSecure:
    process.env.AUTH_COOKIE_SECURE === 'true' || environment === 'production',
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  geminiTimeoutMs: Number(process.env.GEMINI_TIMEOUT_MS || 12000),
  frontendUrls: (process.env.FRONTEND_URLS || '')
    .split(',')
    .map((origin) => origin.trim())
    .map(normalizeOrigin)
    .filter(Boolean),
  adminUserIds: (process.env.ADMIN_USER_IDS || '')
    .split(',')
    .map((userId) => userId.trim())
    .filter(Boolean),
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'gemma3:4b',
  ollamaTimeoutMs: Number(process.env.OLLAMA_TIMEOUT_MS || 8000),
};

function validateConfig() {
  const required = config.databaseUrl
    ? []
    : ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_NAME', 'DB_PORT'];

  if (config.isProd) {
    required.push(
      'FRONTEND_URLS',
    );
  }

  const missing = required.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
  }

  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
    throw new Error('PORT debe ser un número entero entre 1 y 65535');
  }

  if (!Number.isInteger(config.ollamaTimeoutMs) || config.ollamaTimeoutMs < 1000) {
    throw new Error('OLLAMA_TIMEOUT_MS debe ser un entero mayor o igual a 1000');
  }

  if (!Number.isInteger(config.geminiTimeoutMs) || config.geminiTimeoutMs < 1000) {
    throw new Error('GEMINI_TIMEOUT_MS debe ser un entero mayor o igual a 1000');
  }

  if (!['lax', 'strict', 'none'].includes(config.authCookieSameSite)) {
    throw new Error('AUTH_COOKIE_SAME_SITE debe ser lax, strict o none');
  }
  if (config.authCookieSameSite === 'none' && !config.authCookieSecure) {
    throw new Error('AUTH_COOKIE_SECURE=true es obligatorio con SameSite=None');
  }
}

module.exports = { config, validateConfig };
