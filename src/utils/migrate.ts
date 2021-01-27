import { database, logger } from '../helpers';
import { dbmConfig } from '../configs';
import migration from 'migrate-mongo';

export const migrate = async (): Promise<void> => {
  migration.config.set(dbmConfig);
  const connection = await database.getConnection();
  await migration.up(connection);
  logger.debug('Database migrated', { 'database.name': connection.databaseName });
};
