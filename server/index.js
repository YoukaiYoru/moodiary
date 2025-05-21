require('dotenv').config(); // Para cargar variables de entorno
const express = require('express');
const cors = require('cors');
const {
  clerkMiddleware,
  requireAuth,
  getAuth,
  clerkClient,
} = require('@clerk/express');
const routerApi = require('./routes');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  sequelizeErrorHandler,
} = require('./middlewares/error.handler');
const webHookRouter = require('./routes/webHook.router');

const sequelize = require('./libs/sequelize'); // Ajusta la ruta según tu estructura

const app = express();

//Webhook de Clerk para actualizar usuarios
app.use('/clerk/webhook', webHookRouter);

app.use(express.json());

const port = process.env.PORT || 5001;

// CORS Configuration
const whitelist = [
  'http://localhost:5001',
  'https://www.moodiary.live',
  'https://moodiary.live',
  'http://localhost:3000',
  'http://localhost:5173',
];
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

// Clerk Middleware

// Tus rutas (incluyendo la ruta webhook en routes/webHook.router.js)
routerApi(app);

// Middlewares para manejo de errores
app.use(
  clerkMiddleware({
    authorizedParties: ['https://moodiary.live', 'https://www.moodiary.live'],
  }),
);
app.use(logErrors);
app.use(boomErrorHandler);
app.use(sequelizeErrorHandler);
app.use(errorHandler);

// Iniciar servidor (solo DB y servidor, sin syncClerkUsers)
(async () => {
  try {
    console.log('✅ Conexión a la base de datos establecida.');

    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar la app:', err);
  }
})();
