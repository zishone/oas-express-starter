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
import { MongoConfig } from '../types';

export class MongoManager {
  public static async connect({ mongoUri, dbName, clientOptions, dbOptions }: MongoConfig): Promise<MongoManager> {
    const mongo = new MongoManager(mongoUri, dbName, clientOptions, dbOptions);
    mongo.client = await MongoClient.connect(mongoUri, clientOptions);
    return mongo;
  }

  private client?: MongoClient;

  constructor(
    private mongoUri: string,
    private dbName: string,
    private mongoClientOptions?: MongoClientOptions,
    private dbOptions?: MongoClientCommonOption,
  ) {}

  public async getDb(): Promise<Db> {
    if (!this.client || !this.client.isConnected()) {
      this.client = await MongoClient.connect(this.mongoUri, this.mongoClientOptions);
    }
    return this.client.db(this.dbName, this.dbOptions);
  }

  public collection(collectionName: string, model?: Model): MongoCollection {
    return new MongoCollection(this, collectionName, model);
  }
}
