import {
  serve,
  setup,
} from 'swagger-ui-express';
import { App } from './app';
import { ENVIRONMENTS } from './constants';
import { Logger } from './helpers';
import { config } from './config';
import express from 'express';
import { join } from 'path';
import migration from 'migrate-mongo';
import { spec } from './openapi';

const logger = new Logger();
// TODO: log config

const migrateDb = async (): Promise<void> => {
  if (config.ENV !== ENVIRONMENTS.TESTING) {
    return;
  }
  migration.config.set({
    mongodb: {
      url: config.DB_URI,
      databaseName: config.DB_NAME,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    migrationsDir: join('db', 'migrations'),
    changelogCollectionName: 'changelog',
  });
  const { db, client } = await migration.database.connect();
  await migration.up(db);
  await client.close();
  // TODO: Log success
};

const app = express();
app.on('ready', (server): void => {
  server.listen({ port: config.APP_PORT }, async (): Promise<void> => {
    await migrateDb();
    // TODO: Log listening
  });
});

if (config.ENV === ENVIRONMENTS.DEVELOPMENT || config.ENV === ENVIRONMENTS.STAGING) {
  app.use('/apidocs', serve, setup(spec)); 
}

new App(logger, app).configure();

export { app };
