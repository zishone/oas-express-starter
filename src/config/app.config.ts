export const appConfig = {
  name: require('../../package.json').name,
  version: require('../../package.json').version,
  port: parseFloat(process.env.CONFIG_PORT || '3000'),
  env: process.env.NODE_ENV || 'development',
};
