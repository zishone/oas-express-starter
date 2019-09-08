import { join } from 'path';

export const oasConfig = {
  controllers: join(__dirname, '..', 'controllers'),
  checkControllers: true,
  loglevel: process.env.CONFIG_LOG_LEVEL || 'info',
  strict: false,
  router: true,
  validator: true,
  docs: {
    apiDocs: '/api-docs',
    apiDocsPrefix: '',
    swaggerUi: '/docs',
    swaggerUiPrefix: '',
  },
  ignoreUnknownFormats: true,
};
