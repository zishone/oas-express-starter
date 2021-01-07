import { serve, setup } from 'swagger-ui-express';
import { App } from './app';
import { Database } from './helpers';
import { ENVIRONMENTS } from './constants';
import { Logger } from '@zishone/logan';
import { config } from './config';
import express from 'express';
import { migrate } from './utils';
import { spec } from './openapi';

const app = express();
const logger = new Logger({
  defaultMeta: {
    service: config.APP_NAME,
    version: config.APP_VERSION,
  },
});
const database = new Database(logger, config.DB_URI, config.DB_NAME);

app.on(
  'ready',
  async (server: express.Application): Promise<void> => {
    try {
      switch (config.ENV) {
        case ENVIRONMENTS.DEVELOPMENT:
          app.use('/apidocs', serve, setup(spec));
          logger.enableDebug();
          logger.debug('Environment config', { config });
          await migrate(logger, database);
          break;
        case ENVIRONMENTS.STAGING:
        case ENVIRONMENTS.PRODUCTION:
          logger.enableInfo();
          logger.enableInfoFile();
          logger.enableErrorFile();
          await migrate(logger, database);
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
new App(app, logger, database).configure();

export { app, logger, database };
