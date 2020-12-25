import { COLLECTIONS, ENVIRONMENTS } from './constants';
import { Logger, Mongo } from './helpers';
import { serve, setup } from 'swagger-ui-express';
import { App } from './app';
import { config } from './config';
import express from 'express';
import { join } from 'path';
import migration from 'migrate-mongo';
import { spec } from './openapi';

const app = express();
const logger = new Logger();
const mongo = new Mongo(logger, config.DB_URI, config.DB_NAME);
const migrateDb = async (): Promise<void> => {
  try {
    migration.config.set({
      migrationsDir: join('db', 'migrations'),
      changelogCollectionName: COLLECTIONS.MIGRATIONS,
    });
    const db = await mongo.getDb();
    await migration.up(db);
    logger.debug('Database migrated', { 'db.name': config.DB_NAME });
  } catch (error) {
    logger.error('Database migration failed', {
      'db.name': config.DB_NAME,
      error,
    });
    process.exit(1);
  }
};

app.on(
  'ready',
  async (server): Promise<void> => {
    switch (config.ENV) {
      case ENVIRONMENTS.DEVELOPMENT:
        app.use('/apidocs', serve, setup(spec));
        logger.enableDebug();
        logger.debug('Environment config', { config });
        await migrateDb();
        break;
      case ENVIRONMENTS.STAGING:
      case ENVIRONMENTS.PRODUCTION:
        logger.enableInfo();
        await migrateDb();
        break;
    }
    server.listen({ port: config.APP_PORT }, (): void => {
      logger.info('Server listening', { port: config.APP_PORT });
    });
  },
);
new App(logger, mongo, app).configure();

export { mongo, app };
