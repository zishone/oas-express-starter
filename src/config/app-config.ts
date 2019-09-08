export const appConfig = {
  name: require('../../package.json').name,
  port: parseFloat(process.env.CONFIG_PORT  || '3000'),
  env: process.env.NODE_ENV,
};
