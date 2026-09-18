require('dotenv').config(); // Para cargar variables de entorno
const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  sequelizeErrorHandler,
} = require('./middlewares/error.handler');

const sequelize = require('./libs/sequelize'); // Ajusta la ruta según tu estructura
const { config, validateConfig } = require('./config/config');
const {
  securityHeaders,
  createRateLimiter,
} = require('./middlewares/security.handler');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(securityHeaders);
app.use(createRateLimiter({ windowMs: 60_000, max: 180 }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(express.json({ limit: '2mb' }));

const port = config.port;

// CORS Configuration
const whitelist = config.frontendUrls.length > 0
  ? config.frontendUrls
  : ['http://localhost:5173', 'http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  const unsafe = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  const origin = req.headers.origin;
  if (unsafe && origin && !whitelist.includes(origin)) {
    return res.status(403).json({ error: 'Origen no permitido.' });
  }
  next();
});

const { localAuthMiddleware } = require('./middlewares/local-auth.handler');
app.use(localAuthMiddleware);

// Rutas de la API
routerApi(app);

// Middlewares para manejo de errores
app.use(logErrors);
app.use(boomErrorHandler);
app.use(sequelizeErrorHandler);
app.use(errorHandler);

// Iniciar servidor (solo DB y servidor)
(async () => {
  try {
    validateConfig();
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');

    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar la app:', err);
  }
})();
