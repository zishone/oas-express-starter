import { database, logger } from '../helpers';
import { COLLECTIONS } from '../constants';
import { config } from '../configs';
import { join } from 'path';
import migration from 'migrate-mongo';

export const migrate = async (): Promise<void> => {
  migration.config.set({
    migrationsDir: join('db', 'migrations'),
    changelogCollectionName: COLLECTIONS.MIGRATIONS,
  });
  const connection = await database.getConnection();
  await migration.up(connection);
  logger.debug('Database migrated', { 'database.name': config.DB_NAME });
};
