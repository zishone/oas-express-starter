import {
  AggregationCursor,
  CollectionAggregationOptions,
  CollectionInsertManyOptions,
  CommonOptions,
  Cursor,
  DeleteWriteOpResultObject,
  FindOneOptions,
  InsertWriteOpResult,
  MongoCountPreferences,
  UpdateManyOptions,
  UpdateWriteOpResult,
} from 'mongodb';
import {
  BaseModel,
  MongoManager,
} from '.';

export class ModelCrud {
  constructor(
    private mongo: MongoManager,
    private model: BaseModel,
  ) {}

  public async insert(data: any | any[], options?: CollectionInsertManyOptions): Promise<InsertWriteOpResult> {
    const db = await this.mongo.getDb();
    return await db
      .collection(this.model.collectionName!)
      .insertMany(data, options);
  }

  public async find(filter?: any, options?: FindOneOptions): Promise<Cursor> {
    const db = await this.mongo.getDb();
    return await db
      .collection(this.model.collectionName!)
      .find(filter, options);
  }

  public async aggregate(pipeline: any[], options?: CollectionAggregationOptions): Promise<AggregationCursor> {
    const db = await this.mongo.getDb();
    return await db
      .collection(this.model.collectionName!)
      .aggregate(pipeline, options);
  }

  public async distinct(filter: any, key: string, options?: any): Promise<any> {
    const db = await this.mongo.getDb();
    return await db
      .collection(this.model.collectionName!)
      .distinct(key, filter, options);
  }

  public async count(filter?: any, options?: MongoCountPreferences): Promise<number> {
    const db = await this.mongo.getDb();
    return await db
      .collection(this.model.collectionName!)
      .count(filter, options);
  }

  public async update(filter: any = {}, update: any, options?: UpdateManyOptions): Promise<UpdateWriteOpResult> {
    const db = await this.mongo.getDb();
    return await db
      .collection(this.model.collectionName!)
      .updateMany(filter, update, options);
  }

  public async delete(filter?: any, options?: CommonOptions): Promise<DeleteWriteOpResultObject> {
    const db = await this.mongo.getDb();
    return await db
      .collection(this.model.collectionName!)
      .deleteMany(filter, options);
  }
}
