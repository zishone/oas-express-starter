export const authConfig = {
  saltRounds: parseFloat(process.env.CONFIG_SALT_ROUNDS || '12'),
  bearerSecret: process.env.CONFIG_BEARER_SECRET || 'bearer_secret',
  refreshSecret: process.env.CONFIG_REFRESH_SECRET || 'refresh_secret',
  bearerTtl: parseFloat(process.env.CONFIG_BEARER_TTL || '300'),
  refreshTtl: parseFloat(process.env.CONFIG_REFRESH_TTL || '3600'),
};
