import { join } from 'path';
import { appConfig } from '.';

export const oasConfig = {
  controllers: join(__dirname, '..', 'controllers'),
  checkControllers: true,
  loglevel: appConfig.logLevel,
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
