import {
  AggregationCursor,
  CollectionAggregationOptions,
  CollectionInsertManyOptions,
  CommonOptions,
  Cursor,
  DeleteWriteOpResultObject,
  FindOneOptions,
  InsertOneWriteOpResult,
  InsertWriteOpResult,
  MongoCountPreferences,
  UpdateManyOptions,
  UpdateWriteOpResult,
} from 'mongodb';
import {
  Model,
  MongoManager,
} from '.';

export class MongoCollection {
  constructor(
    private mongo: MongoManager,
    private collectionName: string,
    private model?: Model,
  ) {}

  public async insertOne(data: any, options?: CollectionInsertManyOptions): Promise<InsertOneWriteOpResult> {
    const db = await this.mongo.getDb();
    if (this.model) {
      await this.model.validateOne(data);
    }
    return await db.collection(this.collectionName)
      .insertOne(data, options);
  }

  public async insertMany(data: any[], options?: CollectionInsertManyOptions): Promise<InsertWriteOpResult> {
    const db = await this.mongo.getDb();
    if (this.model) {
      await this.model.validateMany(data);
    }
    return await db.collection(this.collectionName)
      .insertMany(data, options);
  }

  public async findOne(filter?: any, options?: FindOneOptions): Promise<any> {
    const db = await this.mongo.getDb();
    return await db.collection(this.collectionName)
      .findOne(filter, options);
  }

  public async find(filter?: any, options?: FindOneOptions): Promise<Cursor> {
    const db = await this.mongo.getDb();
    return db.collection(this.collectionName)
      .find(filter, options);
  }

  public async aggregate(pipeline: any[], options?: CollectionAggregationOptions): Promise<AggregationCursor> {
    const db = await this.mongo.getDb();
    return db.collection(this.collectionName)
      .aggregate(pipeline, options);
  }

  public async distinct(key: string, filter?: any, options?: object): Promise<any> {
    const db = await this.mongo.getDb();
    return await db.collection(this.collectionName)
      .distinct(key, filter, options);
  }

  public async countDocuments(filter?: any, options?: MongoCountPreferences): Promise<number> {
    const db = await this.mongo.getDb();
    return await db.collection(this.collectionName)
      .countDocuments(filter, options);
  }

  public async updateOne(filter: any = {}, update: any, options?: UpdateManyOptions): Promise<UpdateWriteOpResult> {
    delete update._id;
    const db = await this.mongo.getDb();
    return await db.collection(this.collectionName)
      .updateOne(filter, update, options);
  }

  public async updateMany(filter: any = {}, update: any, options?: UpdateManyOptions): Promise<UpdateWriteOpResult> {
    delete update._id;
    const db = await this.mongo.getDb();
    return await db.collection(this.collectionName)
      .updateMany(filter, update, options);
  }

  public async deleteOne(filter?: any, options?: CommonOptions): Promise<DeleteWriteOpResultObject> {
    const db = await this.mongo.getDb();
    return await db.collection(this.collectionName)
      .deleteOne(filter, options);
  }

  public async deleteMany(filter?: any, options?: CommonOptions): Promise<DeleteWriteOpResultObject> {
    const db = await this.mongo.getDb();
    return await db.collection(this.collectionName)
      .deleteMany(filter, options);
  }
}
