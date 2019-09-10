import {
  Db,
  MongoClient,
  MongoClientCommonOption,
  MongoClientOptions,
} from 'mongodb';
import {
  Model,
  MongoCollection,
} from '.';

export interface MongoConfig {
  mongoUri: string;
  dbName: string;
  clientOptions?: MongoClientOptions;
  dbOptions?: MongoClientCommonOption;
}

export class MongoManager {
  private client!: MongoClient;

  constructor(private mongoConfig: MongoConfig) {}

  public async getDb(): Promise<Db> {
    if (!this.client || !this.client.isConnected()) {
      this.client = await MongoClient.connect(this.mongoConfig.mongoUri, this.mongoConfig.clientOptions);
    }
    return this.client.db(this.mongoConfig.dbName, this.mongoConfig.dbOptions);
  }

  public collection(collectionName: string, model?: Model): MongoCollection {
    return new MongoCollection(this, collectionName, model);
  }
}
