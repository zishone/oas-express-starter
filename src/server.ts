import {
  createWriteStream,
  existsSync,
  mkdirSync,
} from 'fs';
import {
  serve,
  setup,
} from 'swagger-ui-express';
import express = require('express');
import morgan = require('morgan');
import debug = require('debug');
import { App } from './app';
import { apply } from 'mongover';
import { config } from './config';
import { spec } from './openapi';

const migrateDb = async () => {
  const intervalsMS = 3000;
  for (;;) {
    try {
      await apply({
        specPath: './db',
        uri: config.DB_URI,
        dbs: ['oasDB'],
        alias: [config.DB_NAME],
      });
      debug(`${config.APP_NAME}:debug:`)('[DEBUG] Successfully migrated database: %s', config.DB_NAME);
      debug(`${config.APP_NAME}:info:`)('[INFO] Successfully migrated database: %s', config.DB_NAME);
      break;
    } catch (error) {
      debug(`${config.APP_NAME}:debug:`)('[DEBUG] Failed to migrate database retrying in: %dms', intervalsMS);
      debug(`${config.APP_NAME}:error:`)('[ERROR] Failed to migrate database retrying in: %dms', intervalsMS);
      await new Promise((resolve) => {
        setTimeout(resolve, intervalsMS);
      });
    }
  }
};

const app = express();

if (config.ENV === 'production' || config.ENV === 'staging') {
  if (!existsSync('./.local')) {
    mkdirSync('./.local');
  }
  const logger = (tokens: morgan.TokenIndexer, req: express.Request, res: express.Response) => [tokens.date(req, res, 'iso'), `[${req.id}]`, tokens['remote-addr'](req, res), '-', tokens.method(req, res), tokens.url(req, res), tokens.status(req, res), tokens.res(req, res, 'content-length'), '-', `${tokens['response-time'](req, res)}ms`].join(' ');
  app.use(morgan(logger, { stream: createWriteStream('./.local/morgan.log', { flags: 'a' }) }));
  app.use(morgan(logger));
  debug.enable(`${config.APP_NAME}:info:,${config.APP_NAME}:fatal:*,${config.APP_NAME}:error:*,${config.APP_NAME}:warn:*`);
  debug(`${config.APP_NAME}:info:`)('\n----------------\n[INFO] Environment configs values:\n%O\n----------------', config);
}

if (config.ENV === 'development' || config.ENV === 'staging') {
  app.use('/apidocs', serve, setup(spec));
}

if (config.ENV === 'development') {
  debug.enable(`${config.APP_NAME}:debug:*,mongover:*`);
  debug(`${config.APP_NAME}:debug:`)('\n----------------\n[DEBUG] Environment configs values:\n%O\n----------------', config);
}

app.on('ready', (server) => {
  server.listen({ port: config.APP_PORT }, async () => {
    if (config.ENV !== 'testing') {
      await migrateDb();
    }

    debug(`${config.APP_NAME}:debug:`)('[DEBUG] Accepting connections at port: %d', config.APP_PORT);
    debug(`${config.APP_NAME}:info:`)('[INFO] Accepting connections at port: %d', config.APP_PORT);
  });
});

new App(app).configure();

export { app };
