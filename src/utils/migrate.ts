import { Logger, Mongo } from '../helpers';
import { COLLECTIONS } from '../constants';
import { config } from '../config';
import { join } from 'path';
import migration from 'migrate-mongo';

export const migrate = async (logger: Logger, mongo: Mongo): Promise<void> => {
  migration.config.set({
    migrationsDir: join('db', 'migrations'),
    changelogCollectionName: COLLECTIONS.MIGRATIONS,
  });
  const db = await mongo.getDb();
  await migration.up(db);
  logger.debug('Database migrated', { 'db.name': config.DB_NAME });
};
