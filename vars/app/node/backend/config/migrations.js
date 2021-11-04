const config = require('../config');

let mod = {};

mod = {
  username: config.get('database.DB_USERNAME'),
  password: config.get('database.DB_PASSWORD'),
  database: config.get('database.DB_DATABASE'),
  host: config.get('database.DB_HOST'),
  port: config.get('database.DB_PORT'),
  dialect: config.get('database.DB_DIALECT')
};

module.exports = mod;