export const authConfig = {
  secret: process.env.CONFIG_JWT_SECRET                             || 'secret',
  accessTokenTtl: parseFloat(process.env.CONFIG_ACCESS_TOKEN_TTL    || '300'),
  refreshTokenTtl: parseFloat(process.env.CONFIG_REFRESH_TOKEN_TTL  || '3600'),
};
