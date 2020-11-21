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
  Mongo,
} from '.';
import {
  dotnotate,
  removeUndefined,
} from '../utils';
import { ERROR_CODES } from '../constants';
import { Fail } from './fail';

export class Collection {
  private mongo: Mongo;
  private collectionName: string;
  private model?: Model;

  constructor(mongo: Mongo, collectionName: string, model?: Model) {
    this.mongo = mongo;
    this.collectionName = collectionName;
    this.model = model;
  }

  public async insertOne(data: any, options?: CollectionInsertManyOptions): Promise<InsertOneWriteOpResult> {
    const db = await this.mongo.getDb();
    if (this.model) {
      await this.model.validateOne(data);
    }
    try {
      return await db.collection(this.collectionName)
        .insertOne(data, options);
    } catch (error) {
      throw this.marshalError(error);
    }
  }

  public async insertMany(data: any[], options?: CollectionInsertManyOptions): Promise<InsertWriteOpResult> {
    const db = await this.mongo.getDb();
    if (this.model) {
      await this.model.validateMany(data);
    }
    try {
      return await db.collection(this.collectionName)
        .insertMany(data, options);
    } catch (error) {
      throw this.marshalError(error);
    }
  }

  public async findOne(filter?: any, options: FindOneOptions | any = {}): Promise<any> {
    const db = await this.mongo.getDb();
    if (options.projection) {
      options.projection._id = 0 ;
    } else {
      options.projection = { _id: 0 };
    }
    try {
      return await db.collection(this.collectionName)
        .findOne(filter, options);
    } catch (error) {
      throw this.marshalError(error);
    }
  }

  public async find(filter?: any, options: FindOneOptions | any = {}): Promise<Cursor> {
    const db = await this.mongo.getDb();
    if (options.projection) {
      options.projection._id = 0 ;
    } else {
      options.projection = { _id: 0 };
    }
    try {
      return db.collection(this.collectionName)
        .find(filter, options);
    } catch (error) {
      throw this.marshalError(error);
    }
  }

  public async aggregate(pipeline: any[], options?: CollectionAggregationOptions): Promise<AggregationCursor> {
    const db = await this.mongo.getDb();
    try {
      return db.collection(this.collectionName)
        .aggregate(pipeline, options);
    } catch (error) {
      throw this.marshalError(error);
    }
  }

  public async distinct(key: string, filter?: any, options?: object): Promise<any> {
    const db = await this.mongo.getDb();
    try {
      return await db.collection(this.collectionName)
        .distinct(key, filter, options);
    } catch (error) {
      throw this.marshalError(error);
    }
  }

  public async countDocuments(filter?: any, options?: MongoCountPreferences): Promise<number> {
    const db = await this.mongo.getDb();
    try {
      return await db.collection(this.collectionName)
        .countDocuments(filter, options);
    } catch (error) {
      throw this.marshalError(error);
    }
  }

  public async updateOne(filter: any = {}, update: any = {}, options?: UpdateManyOptions): Promise<UpdateWriteOpResult> {
    update = removeUndefined(update);
    if (update?.$set) {
      delete update.$set._id;
      if (Object.keys(update.$set).length === 0) {
        delete update.$set;
      } else {
        update.$set = dotnotate(update.$set);
      }
    }
    if (update?.$unset) {
      delete update.$unset._id;
      if (Object.keys(update.$unset).length === 0) {
        delete update.$unset;
      } else {
        update.$unset = dotnotate(update.$unset);
      }
    }
    if (update?.$inc) {
      delete update.$inc._id;
      if (Object.keys(update.$inc).length === 0) {
        delete update.$inc;
      } else {
        update.$inc = dotnotate(update.$inc);
      }
    }
    if (Object.keys(update).length === 0) {
      throw new Fail(403)
        .error({
          errorCode: ERROR_CODES.NOT_ALLOWED,
          keys: [],
          message: 'Please provide valid update fields.',
        })
        .build();
    }
    const db = await this.mongo.getDb();
    try {
      return await db.collection(this.collectionName)
        .updateOne(filter, update, options);
    } catch (error) {
      throw this.marshalError(error);
    }
  }

  public async updateMany(filter: any = {}, update: any, options?: UpdateManyOptions): Promise<UpdateWriteOpResult> {
    update = removeUndefined(update);
    if (update?.$set) {
      delete update.$set._id;
      if (Object.keys(update.$set).length === 0) {
        delete update.$set;
      } else {
        update.$set = dotnotate(update.$set);
      }
    }
    if (update?.$unset) {
      delete update.$unset._id;
      if (Object.keys(update.$unset).length === 0) {
        delete update.$unset;
      } else {
        update.$unset = dotnotate(update.$unset);
      }
    }
    if (Object.keys(update).length === 0) {
      throw new Fail(403)
        .error({
          errorCode: ERROR_CODES.NOT_ALLOWED,
          keys: [],
          message: 'Please provide valid update fields.',
        })
        .build();
    }
    const db = await this.mongo.getDb();
    try {
      return await db.collection(this.collectionName)
        .updateMany(filter, update, options);
    } catch (error) {
      throw this.marshalError(error);
    }
  }

  public async deleteOne(filter?: any, options?: CommonOptions): Promise<DeleteWriteOpResultObject> {
    const db = await this.mongo.getDb();
    try {
      return await db.collection(this.collectionName)
        .deleteOne(filter, options);
    } catch (error) {
      throw this.marshalError(error);
    }
  }

  public async deleteMany(filter?: any, options?: CommonOptions): Promise<DeleteWriteOpResultObject> {
    const db = await this.mongo.getDb();
    try {
      return await db.collection(this.collectionName)
        .deleteMany(filter, options);
    } catch (error) {
      throw this.marshalError(error);
    }
  }

  private marshalError(error: any): any {
    switch (error.code) {
      case 11000:
        error = new Fail(403)
          .error({
            errorCode: ERROR_CODES.DUPLICATE,
            keys: Object.keys(error.keyValue),
            message: `${Object.keys(error.keyValue).join(', ')} already exists.`,
          })
          .build();
        break;
    }
    return error;
  }
}
