import { Db, MongoClient, MongoClientCommonOption, MongoClientOptions } from 'mongodb';
import { Logger } from '.';

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
}
