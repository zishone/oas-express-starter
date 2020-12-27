import { Db, MongoClient, MongoClientCommonOption, MongoClientOptions } from 'mongodb';
import { ERROR_CODES } from '../constants';
import { Logger } from '.';
import httpError from 'http-errors';

export interface MongoConfig {
  mongoUri: string;
  dbName: string;
  clientOptions?: MongoClientOptions;
  dbOptions?: MongoClientCommonOption;
}

export class Mongo {
  private logger: Logger;
  private dbUri: string;
  private dbName: string;
  private client!: MongoClient;

  constructor(logger: Logger, dbUri: string, dbName: string) {
    this.logger = logger;
    this.dbUri = dbUri;
    this.dbName = dbName;
  }

  public async getDb(): Promise<Db> {
    this.logger.debugFunction('Mongo.getDb', arguments);
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
    this.logger.debugFunction('Mongo.error', arguments);
    switch (error.code) {
      case 11000:
        throw httpError(403, 'Data already exists', {
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
