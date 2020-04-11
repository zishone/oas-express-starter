export const config = {
  ENV:            process.env.NODE_ENV                      || 'development',

  APP_PORT:           parseFloat(process.env.CONFIG_APP_PORT    || '3000'),

  SALT_ROUNDS:    parseFloat(process.env.CONFIG_SALT_ROUNDS || '12'),
  BEARER_SECRET:  process.env.CONFIG_BEARER_SECRET          || 'bearer_secret',
  REFRESH_SECRET: process.env.CONFIG_REFRESH_SECRET         || 'refresh_secret',
  BEARER_TTL:     parseFloat(process.env.CONFIG_BEARER_TTL  || '300'),
  REFRESH_TTL:    parseFloat(process.env.CONFIG_REFRESH_TTL || '3600'),

  DB_URI:         process.env.CONFIG_DB_URI                 || 'mongodb://127.0.0.1:27017/',
  DB_NAME:        process.env.CONFIG_DB_NAME                || 'oasDB',
};
