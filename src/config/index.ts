import dotenv from 'dotenv';

dotenv.config();

const { NODE_ENV, CONFIG_APP_PORT, CONFIG_DB_URI, CONFIG_DB_NAME, CONFIG_LOGIN_SECRET, CONFIG_LOGIN_TTL } = process.env;

export const config = {
  APP_NAME: require('../../package.json').name,
  APP_VERSION: require('../../package.json').version,

  ENV: NODE_ENV || 'development',

  APP_PORT: parseFloat(CONFIG_APP_PORT || '3000'),

  DB_URI: CONFIG_DB_URI || 'mongodb://127.0.0.1:27017',
  DB_NAME: CONFIG_DB_NAME || 'oasDB',

  LOGIN_SECRET: CONFIG_LOGIN_SECRET || 'login_secret',
  LOGIN_TTL: parseFloat(CONFIG_LOGIN_TTL || '2592000'),
};
