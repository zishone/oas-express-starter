import express = require('express');
import { App } from './app';
import { appConfig, mongoConfig } from './config';
import { Logger } from './helpers';
import { apply } from 'mongover';
import { join } from 'path';

const logger = new Logger('root', __filename);

const app = express();

app.on('ready', () => {
  app.listen({ port: appConfig.port }, () => {
    logger.info('Accepting connections at port: %d', appConfig.port);
  });
});

new App(app).configure();

apply({
  specPath: './dist/database',
  uri: mongoConfig.mongoUri,
});

export { app };
