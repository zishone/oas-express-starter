import { COLLECTIONS } from '../constants';
import { Database } from '../helpers';
import { Logger } from '@zishone/logan';
import { config } from '../config';
import { join } from 'path';
import migration from 'migrate-mongo';

export const migrate = async (logger: Logger, database: Database): Promise<void> => {
  migration.config.set({
    migrationsDir: join('db', 'migrations'),
    changelogCollectionName: COLLECTIONS.MIGRATIONS,
  });
  const connection = await database.getConnection();
  await migration.up(connection);
  logger.debug('Database migrated', { 'database.name': config.DB_NAME });
};
