import {
  AggregationCursor,
  CollectionAggregationOptions,
  CollectionInsertManyOptions,
  CommonOptions,
  Cursor,
  FilterQuery,
  FindOneOptions,
  MongoCountPreferences,
  UpdateManyOptions,
  UpdateQuery,
} from 'mongodb';
import { Logger, Mongo } from '.';
import { ERROR_CODES } from '../constants';
import { dotnotate } from '@zishone/dotnotate';
import httpError from 'http-errors';
import joi from 'joi';
import { nanoid } from 'nanoid';

export class Model<Data> {
  protected logger: Logger;
  private mongo: Mongo;
  private schema: joi.Schema;
  private collectionName: string;

  constructor(logger: Logger, mongo: Mongo, schema: joi.Schema, collectionName: string) {
    this.logger = logger;
    this.mongo = mongo;
    this.schema = schema;
    this.collectionName = collectionName;
  }

  private async validate(data: Data | Data[]): Promise<Data[]> {
    this.logger.debugFunction('Model.validate', arguments);
    const dataArray = Array.isArray(data) ? data : [data];
    const result = joi.array().items(this.schema).validate(dataArray);
    if (result.error) {
      throw httpError(400, 'Data invalid', {
        errorCode: ERROR_CODES.INVALID,
        details: result.error,
      });
    }
    return result.value;
  }

  private mongoError(error: any) {
    this.logger.debugFunction('Model.mongoError', arguments);
    switch (error.code) {
      case 11000:
        throw httpError(403, 'Data already exists', {
          errorCode: ERROR_CODES.DUPLICATE,
          details: error,
        });
      case 16840:
        throw httpError(403, 'Update empty', {
          errorCode: ERROR_CODES.INVALID,
          details: error,
        });
      default:
        throw error;
    }
  }

  public async count(filter: FilterQuery<Data> = {}, options: MongoCountPreferences = {}): Promise<number> {
    this.logger.debugFunction('Model.count', arguments);
    const db = await this.mongo.getDb();
    try {
      return await db.collection(this.collectionName).countDocuments(filter, options);
    } catch (error) {
      throw this.mongoError(error);
    }
  }

  public async fetch(filter: FilterQuery<Data> = {}, options: FindOneOptions<any> = {}): Promise<Cursor<Data>> {
    this.logger.debugFunction('Model.fetch', arguments);
    const db = await this.mongo.getDb();
    try {
      options.projection = {
        _id: 0,
        ...(options.projection || {}),
      };
      const cursor = db.collection(this.collectionName).find(filter, options);
      return cursor;
    } catch (error) {
      throw this.mongoError(error);
    }
  }

  public async fetchOne(filter: FilterQuery<Data> = {}, options: FindOneOptions<any> = {}): Promise<Data> {
    this.logger.debugFunction('Model.fetchOne', arguments);
    const db = await this.mongo.getDb();
    try {
      options.projection = {
        _id: 0,
        ...(options.projection || {}),
      };
      const data = await db.collection(this.collectionName).findOne(filter, options);
      if (!data) {
        throw httpError(404, 'Data not found', { errorCode: ERROR_CODES.NOT_FOUND });
      }
      return data;
    } catch (error) {
      throw this.mongoError(error);
    }
  }

  public async aggregate<AggregationData>(
    pipeline: object[],
    options: CollectionAggregationOptions = {},
  ): Promise<AggregationCursor<AggregationData>> {
    this.logger.debugFunction('Model.aggregate', arguments);
    const db = await this.mongo.getDb();
    try {
      const cursor = db.collection(this.collectionName).aggregate(pipeline, options);
      return cursor;
    } catch (error) {
      throw this.mongoError(error);
    }
  }

  public async save(data: Data | Data[], options: CollectionInsertManyOptions = {}): Promise<string[]> {
    this.logger.debugFunction('Model.save', arguments);
    const dataArray = await this.validate(data);
    const ids: string[] = [];
    const db = await this.mongo.getDb();
    try {
      const dataArrayMapped = dataArray.map((d: any): string => {
        const id = nanoid(12);
        delete d.id;
        ids.push(id);
        return {
          id,
          ...d,
        };
      });
      await db.collection(this.collectionName).insertMany(dataArrayMapped, options);
      return ids;
    } catch (error) {
      throw this.mongoError(error);
    }
  }

  public async update(
    filter: FilterQuery<Data>,
    update: UpdateQuery<any>,
    options: UpdateManyOptions = {},
  ): Promise<void> {
    this.logger.debugFunction('Model.update', arguments);
    const db = await this.mongo.getDb();
    try {
      if (update.$set) {
        update.$set = dotnotate(update.$set);
      }
      if (update.$unset) {
        update.$unset = dotnotate(update.$unset);
      }
      await db.collection(this.collectionName).updateMany(filter, JSON.parse(JSON.stringify(update)), options);
    } catch (error) {
      throw this.mongoError(error);
    }
  }

  public async delete(filter: FilterQuery<Data>, options: CommonOptions = {}): Promise<void> {
    this.logger.debugFunction('Model.delete', arguments);
    const db = await this.mongo.getDb();
    try {
      await db.collection(this.collectionName).deleteMany(filter, options);
    } catch (error) {
      throw this.mongoError(error);
    }
  }
}
