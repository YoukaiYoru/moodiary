const path = require('node:path');
const dotenv = require('dotenv');

const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `../.env.${environment}`) });
dotenv.config();
const dns = require('node:dns');

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
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  clerkWebhookSigningSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'gemma3:4b',
  ollamaTimeoutMs: Number(process.env.OLLAMA_TIMEOUT_MS || 8000),
};

function validateConfig() {
  const required = config.databaseUrl
    ? []
    : ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_NAME', 'DB_PORT'];

  if (config.isProd) {
    required.push('CLERK_SECRET_KEY', 'CLERK_WEBHOOK_SIGNING_SECRET');
  }

  const missing = required.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
  }
}

module.exports = { config, validateConfig };
