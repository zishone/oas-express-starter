import {
  CommonOptions,
  MongoCountPreferences as CountOptions,
  Cursor,
  Db,
  FindOneOptions as FetchOptions,
  FilterQuery as Filter,
  MongoClient,
  CollectionInsertManyOptions as SaveOptions,
  UpdateQuery as Update,
  UpdateManyOptions as UpdateOptions,
} from 'mongodb';
import { ERROR_CODES } from '../constants';
import { config } from '../configs';
import httpError from 'http-errors';
import { logger } from '.';

export class Database {
  private client: MongoClient;

  constructor(private dbUri: string, private dbName: string) {}

  public async getConnection(): Promise<Db> {
    logger.debugFunctionCall('Database.getConnection', arguments);
    try {
      if (!this.client) {
        throw new Error();
      }
      await this.client.db('test').command({ ping: 1 });
    } catch (_error: any) {
      this.client = await MongoClient.connect(this.dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    return this.client.db(this.dbName);
  }

  public error(error: any) {
    logger.debugFunctionCall('Database.error', arguments);
    switch (error.code) {
      case 11000:
        throw httpError(403, 'Entity already exists', {
          errorCode: ERROR_CODES.DUPLICATE,
          details: error,
        });
      case 9:
        throw httpError(400, 'Update empty', {
          errorCode: ERROR_CODES.INVALID,
          details: error,
        });
      default:
        throw error;
    }
  }
}

export const database = new Database(config.DB_URI, config.DB_NAME);
export { CommonOptions, CountOptions, Cursor, FetchOptions, Filter, SaveOptions, Update, UpdateOptions };
