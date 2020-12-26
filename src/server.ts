import { Logger, Mongo } from './helpers';
import { serve, setup } from 'swagger-ui-express';
import { App } from './app';
import { ENVIRONMENTS } from './constants';
import { config } from './config';
import express from 'express';
import { migrate } from './utils';
import { spec } from './openapi';

const app = express();
const logger = new Logger();
const mongo = new Mongo(logger, config.DB_URI, config.DB_NAME);

app.on(
  'ready',
  async (server): Promise<void> => {
    try {
      switch (config.ENV) {
        case ENVIRONMENTS.DEVELOPMENT:
          app.use('/apidocs', serve, setup(spec));
          logger.enableDebug();
          logger.debug('Environment config', { config });
          await migrate(logger, mongo);
          break;
        case ENVIRONMENTS.STAGING:
        case ENVIRONMENTS.PRODUCTION:
          logger.enableInfo();
          await migrate(logger, mongo);
          break;
      }
      server.listen({ port: config.APP_PORT }, (): void => {
        logger.info('Server listening', { port: config.APP_PORT });
      });
    } catch (error) {
      logger.error('Server startup failed', { error });
      process.exit(1);
    }
  },
);
new App(logger, mongo, app).configure();

export { logger, mongo, app };
