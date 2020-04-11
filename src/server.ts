import debug = require('debug');
import express = require('express');
import { apply } from 'mongover';
import { App } from './app';
import { config } from './config';

const app = express();

app.on('ready', () => {
  app.listen({ port: config.APP_PORT }, () => {
    debug(`${require('../package.json').name}:debug:`)('Accepting connections at port: %d', config.APP_PORT);
    debug(`${require('../package.json').name}:info:`)('Accepting connections at port: %d', config.APP_PORT);
  });
});

new App(app).configure();

if (config.ENV !== 'testing') {
  apply({
    specPath: './dist/database',
    uri: config.DB_URI,
  });
}

export { app };
