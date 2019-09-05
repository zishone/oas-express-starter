import {
  AggregationCursor,
  CollectionAggregationOptions,
  CollectionInsertManyOptions,
  CommonOptions,
  Cursor,
  Db,
  DeleteWriteOpResultObject,
  FindOneOptions,
  InsertWriteOpResult,
  MongoClient,
  MongoClientCommonOption,
  MongoClientOptions,
  MongoCountPreferences,
  UpdateManyOptions,
  UpdateWriteOpResult,
} from 'mongodb';

export class MongoManager {
  public static async connect(mongoUri: string, dbName: string, mongoClientOptions?: MongoClientOptions, dbOptions?: MongoClientCommonOption): Promise<MongoManager> {
    const mongo = new MongoManager(mongoUri, dbName, mongoClientOptions, dbOptions);
    mongo.client = await MongoClient.connect(mongoUri, mongoClientOptions);
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
}
