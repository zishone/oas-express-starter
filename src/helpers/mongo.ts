import {
  Db,
  MongoClient,
  MongoClientCommonOption,
  MongoClientOptions,
} from 'mongodb';

export interface MongoConfig {
  mongoUri: string;
  dbName: string;
  clientOptions?: MongoClientOptions;
  dbOptions?: MongoClientCommonOption;
}

export class Mongo {
  private client!: MongoClient;
  private dbUri: string;
  private dbName: string;

  constructor(dbUri: string, dbName: string) {
    this.dbUri = dbUri;
    this.dbName = dbName;
  }

  public async getDb(): Promise<Db> {
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
