import { Request } from 'express';
import { join } from 'path';
import { authenticationMiddleware } from '../middlewares';

export const oasConfig = {
  controllers: join(__dirname, '..', 'controllers'),
  checkControllers: true,
  loglevel: process.env.CONFIG_LOG_LEVEL || 'info',
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
