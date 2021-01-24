import { database, logger } from '../helpers';
import migration from 'migrate-mongo';

export const migrate = async (): Promise<void> => {
  const config = require('../../db/migrationrc.js');
  migration.config.set(config);
  const connection = await database.getConnection();
  await migration.up(connection);
  logger.debug('Database migrated', { 'database.name': config.DB_NAME });
};
