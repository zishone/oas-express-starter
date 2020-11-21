import dotenv = require('dotenv');

dotenv.config();

const {
  NODE_ENV,
  CONFIG_CORS_ORIGIN,
  CONFIG_CORS_METHODS,
  CONFIG_CORS_CREDENTIALS,
  CONFIG_APP_PORT,
  CONFIG_DB_URI,
  CONFIG_DB_NAME,
  CONFIG_SALT_ROUNDS,
  CONFIG_SALT_KEY,
  CONFIG_LOGIN_SECRET,
  CONFIG_LOGIN_TTL,
} = process.env;

export const config = {
  APP_NAME: require('../../package.json').name,
  APP_VERSION: require('../../package.json').version,

  ENV: NODE_ENV || 'development',

  CORS_ORIGIN: CONFIG_CORS_ORIGIN || '*',
  CORS_METHODS: CONFIG_CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
  CORS_CREDENTIALS: JSON.parse(CONFIG_CORS_CREDENTIALS || 'true'),

  APP_PORT: parseFloat(CONFIG_APP_PORT || '3000'),

  DB_URI: CONFIG_DB_URI || 'mongodb://127.0.0.1:27017',
  DB_NAME: CONFIG_DB_NAME || 'oasDB',

  SALT_ROUNDS: parseFloat(CONFIG_SALT_ROUNDS || '12'),
  SALT_KEY: CONFIG_SALT_KEY || 'salt',

  LOGIN_SECRET: CONFIG_LOGIN_SECRET || 'login_secret',
  LOGIN_TTL: parseFloat(CONFIG_LOGIN_TTL || '2592000'),
};
