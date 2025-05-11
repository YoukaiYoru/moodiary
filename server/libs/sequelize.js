const { Sequelize } = require('sequelize');
const { config } = require('../config/config');
const setupModels = require('../db/models/index');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const options = {
  dialect: 'postgres',
  logging: config.isProd ? false : console.log,
  dialectOptions: {
    ssl: config.isProd ? { require: true, rejectUnauthorized: false } : false,
  },
};

const sequelize = new Sequelize(URI, options);
setupModels(sequelize);

module.exports = sequelize;
