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
    TOKEN_KEY: '96055621a2e5cc8aa7bb1ee9c315bcf6c765de05fb25ecef71a678ab5b0a4167',
    SALT_ROUND: 10
  },

  secret: {
    COMMUNICATE_API_KEY: "78e2f3e46fd40273b0abe50af1b9100cd6f4aab0eda33eb5bdcec55e003464d7", //SHA256
    COMMUNICATE_API_KEY_RAW: "hyperledger-fabric-sdk-nodejs-with-laravel-system: HungThinh0710.aka.Phoenix.5674937106", //RAW_TEXT
  }
});

// Load environment dependent configuration
const env = config.get('env');
// Load it into convict.
config.loadFile(require('path').resolve(`backend/config/${env}.json`));

module.exports = config;
