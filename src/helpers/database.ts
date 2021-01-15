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
import { Logger } from '@zishone/logan';
import httpError from 'http-errors';

export class Database {
  private logger: Logger;
  private dbUri: string;
  private dbName: string;
  private client!: MongoClient;

  constructor(logger: Logger, dbUri: string, dbName: string) {
    this.logger = logger;
    this.dbUri = dbUri;
    this.dbName = dbName;
  }

  public async getConnection(): Promise<Db> {
    this.logger.debugFunctionCall('Database.getConnection', arguments);
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
    this.logger.debugFunctionCall('Database.error', arguments);
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

export { CommonOptions, CountOptions, Cursor, FetchOptions, Filter, SaveOptions, Update, UpdateOptions };
