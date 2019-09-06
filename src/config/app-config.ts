export const appConfig = {
  name: require('../../package.json').name,
  port: parseFloat(process.env.CONFIG_PORT  || '3000'),
  logLevel: process.env.CONFIG_LOG_LEVEL    || 'info',
};
