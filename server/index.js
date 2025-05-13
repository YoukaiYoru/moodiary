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

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// CORS Configuration
const whitelist = [
  'http://localhost:5001',
  'https://myapp.com',
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

// Clerk Middleware with options
app.use(clerkMiddleware());

// Your existing routes
routerApi(app);

// Error handling middlewares
app.use(logErrors);
app.use(boomErrorHandler);
app.use(sequelizeErrorHandler);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
