export const appConfig = {
  name: require('../../package.json').name,
  port: parseFloat(process.env.CONFIG_PORT                  || '3000'),
  accessControl: {
    allowOrigin: process.env.CONFIG_ALLOW_ORIGIN            || '*',
    allowMethods: process.env.CONFIG_ALLOW_METHODS          || 'GET,POST,PUT,DELETE,HEAD,OPTIONS',
    allowCredentials: process.env.CONFIG_ALLOW_CREDENTIALS  || 'false',
  },
  logLevel: process.env.CONFIG_LOG_LEVEL                    || 'info',
};
