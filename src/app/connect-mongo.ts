import { mongoConfig } from '../config';
import {
  Logger,
  MongoManager,
} from '../helpers';
import { AppContext } from '../types';

const log = new Logger(__filename);

export const connectMongo = async (context: AppContext): Promise<AppContext> => {
  try {
    context.mongo = await MongoManager.connect(mongoConfig.mongoUri, mongoConfig.dbName, mongoConfig.clientOptions);
  } catch (error) {
    log.warn('Could not connect to database %O', error);
  }
  return context;
};
