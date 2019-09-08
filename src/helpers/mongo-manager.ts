import {
  Db,
  MongoClient,
} from 'mongodb';
import {
  Model,
  MongoCollection,
} from '.';

export class MongoManager {
  private client!: MongoClient;
  private mongoUri: string;
  private dbName: string;
  private clientOptions: object;
  private dbOptions: object;

  constructor(mongoConfig: any) {
    this.mongoUri = mongoConfig.mongoUri,
    this.dbName = mongoConfig.dbName,
    this.clientOptions = mongoConfig.clientOptions;
    this.dbOptions = mongoConfig.dbOptions;
  }

  public async getDb(): Promise<Db> {
    if (!this.client || !this.client.isConnected()) {
      this.client = await MongoClient.connect(this.mongoUri, this.clientOptions);
    }
    return this.client.db(this.dbName, this.dbOptions);
  }

  public collection(collectionName: string, model?: Model): MongoCollection {
    return new MongoCollection(this, collectionName, model);
  }
}
