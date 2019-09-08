import express = require('express');
import { App } from './app';
import { appConfig } from './config';
import { Logger } from './helpers';

const logger = new Logger('root', __filename);

const app = express();

app.on('ready', () => {
  app.listen({ port: appConfig.port }, () => {
    logger.info('Accepting connections at port: %d', appConfig.port);
  });
});

new App(app).configure();

export { app };
