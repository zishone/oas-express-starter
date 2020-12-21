import {
  CollectionInsertManyOptions,
  CommonOptions,
  FilterQuery,
  FindOneOptions,
  MongoCountPreferences,
  UpdateManyOptions,
  UpdateQuery,
} from 'mongodb';
import {
  Logger,
  Mongo,
} from '.';
import { ERROR_CODES } from '../constants';
import { dotnotate } from '../utils';
import httpError from 'http-errors';
import joi from 'joi';
import { nanoid } from 'nanoid';

export class Model {
  private logger: Logger;
  private mongo: Mongo;
  private schema: joi.Schema;
  private collectionName: string;

  constructor(logger: Logger, mongo: Mongo, schema: joi.Schema, collectionName: string) {
    this.logger = logger;
    this.mongo = mongo;
    this.schema = schema;
    this.collectionName = collectionName;
  }

  private async validate(value: any): Promise<any[]> {
    value = Array.isArray(value) ? value : [value];
    const result = joi.array().items(this.schema).validate(value);
    if (result.error) {
      throw httpError(400, 'Data invalid', {
        errorCode: ERROR_CODES.INVALID,
        details: result.error,
      });
    }
    return result.value;
  }

  private mongoError(error: any) {
    switch (error.code) {
      case 11000:
        throw httpError(403, 'Data already exists', {
          errorCode: ERROR_CODES.INVALID,
          detail: error,
        });
      default:
        throw error;
    }
  }

  public async count(filter: FilterQuery<any> = {}, options: MongoCountPreferences = {}): Promise<number> {
    const db = await this.mongo.getDb();
    try {
      return await db.collection(this.collectionName)
        .countDocuments(filter, options);
    } catch (error) {
      throw this.mongoError(error);
    }
  }

  public async fetch(filter: FilterQuery<any> = {}, options: FindOneOptions<any> = {}): Promise<{ [key: string]: any }[]> {
    const db = await this.mongo.getDb();
    try {
      const cursor = db.collection(this.collectionName)
        .find(filter, options);
      return await cursor.toArray();
    } catch (error) {
      throw this.mongoError(error);
    }
  }

  public async fetchOne(filter: FilterQuery<any> = {}, options: FindOneOptions<any> = {}): Promise<{ [key: string]: any }> {
    const db = await this.mongo.getDb();
    try {
      const one = await db.collection(this.collectionName)
        .findOne(filter, options);
      if (!one) {
        throw httpError(404, 'Data not found', { errorCode: ERROR_CODES.NOT_FOUND });
      }
      return one;
    } catch (error) {
      throw this.mongoError(error);
    }
  }

  public async save(data: any, options: CollectionInsertManyOptions = {}): Promise<string[]> {
    data = await this.validate(data);
    const ids: string[] = [];
    const db = await this.mongo.getDb();
    try {
      await db.collection(this.collectionName)
        .insertMany(data.map((one: { [key: string]: any }): { [key: string]: any } => {
          const id = nanoid(12);
          ids.push(id);
          return {
            id,
            ...one,
          }
        }), options);
      return ids;
    } catch (error) {
      throw this.mongoError(error);
    }
  }

  public async update(filter: FilterQuery<any> = {}, update: UpdateQuery<any>, options: UpdateManyOptions = {}): Promise<void> {
    const db = await this.mongo.getDb();
    try {
      if (update.$set) {
        update.$set = dotnotate(update.$set);
      }
      if (update.$unset) {
        update.$unset = dotnotate(update.$unset);
      }
      await db.collection(this.collectionName)
        .updateMany(filter, JSON.parse(JSON.stringify(update)), options);
    } catch (error) {
      throw this.mongoError(error);
    }
  }

  public async delete(filter: FilterQuery<any> = {}, options: CommonOptions = {}): Promise<void> {
    const db = await this.mongo.getDb();
    try {
      await db.collection(this.collectionName)
        .deleteMany(filter, options);
    } catch (error) {
      throw this.mongoError(error);
    }
  }
}
