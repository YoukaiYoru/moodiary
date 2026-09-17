const { ValidationError } = require('sequelize');
const boom = require('@hapi/boom');

function logErrors(err, req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    console.error(`[${req.method} ${req.originalUrl}] ${err.name || 'Error'}: ${err.message}`);
  } else {
    console.error(err);
  }
  next(err);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Origen no permitido.' });
  }
  const statusCode = Number(err.statusCode) || 500;
  res.status(statusCode).json({
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { error: err.message }),
  });
}
function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    return res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

function sequelizeErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(409).json({
      statusCode: 409,
      message: err.message,
      ...(process.env.NODE_ENV !== 'production' && { errors: err.errors }),
    });
  }
  next(err);
}

module.exports = {
  logErrors,
  errorHandler,
  boomErrorHandler,
  sequelizeErrorHandler,
};
