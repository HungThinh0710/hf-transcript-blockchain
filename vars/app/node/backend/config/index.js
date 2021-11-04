const convict = require('convict');

// Define a config schema
const config = convict({

  env: {
    doc: 'Application environment',
    env: 'NODE_ENV',
    format: ['production', 'development', 'staging'],
    // Defaulting to production might prevent the leaking of debug information when
    // it's not set properly.
    default: 'development'
  },

  server: {
    ports: {
      http: {
        doc: 'HTTP port',
        default: 3000
      }
    }
  },

  reporting: {
    sentry: {
      dsn: {
        doc: 'Sentry Client TOKEN (DSN)',
        default: null
      }
    }
  },

  api: {
    base: ''
  },

  database: {
    DB_HOST: 'localhost',
    DB_PORT: 3306,
    DB_DATABASE: 'timesheet',
    DB_USERNAME: 'root',
    DB_PASSWORD: '!pwd4root',
    DB_DIALECT: 'mysql',
    DB_LOGGING: true,
  },
  mongoDB: {
    url: 'mongodb+srv://eddy:<password>@cluster0-ivao9.mongodb.net/<dbname>?retryWrites=true&w=majority'
  },

  jwt: {
    TOKEN_KEY: 'dgj1qgh21j125125k1hj25j125ghj21g4j1h2g51j5g6b09u8',
    SALT_ROUND: 10
  }
});

// Load environment dependent configuration
const env = config.get('env');
// Load it into convict.
config.loadFile(require('path').resolve(`backend/config/${env}.json`));

module.exports = config;
