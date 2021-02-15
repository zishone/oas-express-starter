import 'dotenv-defaults/config';
import { hostname } from 'os';

const { NODE_ENV, CONFIG_APP_PORT, CONFIG_DB_URI, CONFIG_DB_NAME, CONFIG_LOGIN_SECRET, CONFIG_LOGIN_TTL } = process.env;

export const envConfig = {
  ENV: NODE_ENV,
  HOSTNAME: hostname(),

  APP_PORT: parseFloat(CONFIG_APP_PORT),

  DB_URI: CONFIG_DB_URI,
  DB_NAME: CONFIG_DB_NAME,

  LOGIN_SECRET: CONFIG_LOGIN_SECRET,
  LOGIN_TTL: parseFloat(CONFIG_LOGIN_TTL),
};
