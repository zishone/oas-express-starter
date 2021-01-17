import { serve, setup } from 'swagger-ui-express';
import { App } from './app';
import { ENVIRONMENTS } from './constants';
import { config } from './configs';
import express from 'express';
import { logger } from './helpers';
import { migrate } from './utils';
import { spec } from './openapi';

const app = express();

app.on(
  'ready',
  async (server: express.Application): Promise<void> => {
    try {
      switch (config.ENV) {
        case ENVIRONMENTS.DEVELOPMENT:
          app.use('/apidocs', serve, setup(spec));
          logger.enableDebug();
          logger.debug('Environment config', { config });
          await migrate();
          break;
        case ENVIRONMENTS.STAGING:
        case ENVIRONMENTS.PRODUCTION:
          logger.enableInfo();
          logger.enableInfoFile();
          logger.enableErrorFile();
          await migrate();
          break;
      }
      server.listen({ port: config.APP_PORT }, (): void => {
        config.APP_PORT = server.address().port;
        logger.info('Server listening', { port: config.APP_PORT });
      });
    } catch (error) {
      logger.error('Server startup failed', { error });
      process.exit(1);
    }
  },
);
new App(app).configure();

export { app };
