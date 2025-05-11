const express = require('express');
const cors = require('cors');
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

const whitelist = ['http://localhost:5001', 'https://myapp.com'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(options));

routerApi(app);
app.use(logErrors);
app.use(boomErrorHandler);
app.use(sequelizeErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
