import { Request } from 'express';
import { join } from 'path';
import { loggerConfig } from '.';
import { authenticationMiddleware } from '../middlewares';

export const oasConfig = {
  controllers: join(__dirname, '..', 'controllers'),
  checkControllers: true,
  loglevel: loggerConfig.level,
  strict: true,
  router: true,
  validator: true,
  docs: {
    apiDocs: '/api-docs',
    apiDocsPrefix: '',
    swaggerUi: '/docs',
    swaggerUiPrefix: '',
  },
  ignoreUnknownFormats: true,
  oasSecurity: true,
  securityFile: {
    bearerAuth: (req: Request) => {
      authenticationMiddleware()(req, req.res, req.next);
    },
  },
};
