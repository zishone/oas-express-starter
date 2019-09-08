import { App } from './app';
import { appConfig } from './config';
import { Logger } from './helpers';

const logger = new Logger('root', __filename);

new App()
  .initialize()
  .then((app) => {
    app.listen({ port: appConfig.port }, () => {
      logger.info('Accepting connections at port: %d', appConfig.port);
    });
  });
