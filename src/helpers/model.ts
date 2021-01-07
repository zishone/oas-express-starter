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
import { Database } from '.';
import { ERROR_CODES } from '../constants';
import { Logger } from '@zishone/logan';
import { dotnotate } from '@zishone/dotnotate';
import httpError from 'http-errors';
import joi from 'joi';
import { nanoid } from 'nanoid';

export class Model<Data> {
  protected logger: Logger;
  private database: Database;
  private schema: joi.Schema;
  private collectionName: string;

  constructor(logger: Logger, database: Database, schema: joi.Schema, collectionName: string) {
    this.logger = logger;
    this.database = database;
    this.schema = schema;
    this.collectionName = collectionName;
  }

  private async validate(data: Partial<Data | Data[]>): Promise<Data[]> {
    this.logger.debugFunctionCall('Model.validate', arguments);
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

  public async count(filter: FilterQuery<Data> = {}, options: MongoCountPreferences = {}): Promise<number> {
    this.logger.debugFunctionCall('Model.count', arguments);
    const connection = await this.database.getConnection();
    try {
      return await connection.collection(this.collectionName).countDocuments(filter, options);
    } catch (error) {
      throw this.database.error(error);
    }
  }

  public async fetch(filter: FilterQuery<Data> = {}, options: FindOneOptions<any> = {}): Promise<Cursor<Data>> {
    this.logger.debugFunctionCall('Model.fetch', arguments);
    const connection = await this.database.getConnection();
    try {
      options.projection = {
        _id: 0,
        ...(options.projection || {}),
      };
      const cursor = connection.collection(this.collectionName).find(filter, options);
      return cursor;
    } catch (error) {
      throw this.database.error(error);
    }
  }

  public async fetchOne(filter: FilterQuery<Data> = {}, options: FindOneOptions<any> = {}): Promise<Data> {
    this.logger.debugFunctionCall('Model.fetchOne', arguments);
    const connection = await this.database.getConnection();
    try {
      options.projection = {
        _id: 0,
        ...(options.projection || {}),
      };
      const data = await connection.collection(this.collectionName).findOne(filter, options);
      if (!data) {
        throw httpError(404, 'Data not found', { errorCode: ERROR_CODES.NOT_FOUND });
      }
      return data;
    } catch (error) {
      throw this.database.error(error);
    }
  }

  public async aggregate<AggregationData>(
    pipeline: object[],
    options: CollectionAggregationOptions = {},
  ): Promise<AggregationCursor<AggregationData>> {
    this.logger.debugFunctionCall('Model.aggregate', arguments);
    const connection = await this.database.getConnection();
    try {
      const cursor = connection.collection(this.collectionName).aggregate(pipeline, options);
      return cursor;
    } catch (error) {
      throw this.database.error(error);
    }
  }

  public async save(data: Data | Data[], options: CollectionInsertManyOptions = {}): Promise<string[]> {
    this.logger.debugFunctionCall('Model.save', arguments);
    const dataArray = await this.validate(data);
    const ids: string[] = [];
    const connection = await this.database.getConnection();
    try {
      const dataArrayMapped = dataArray.map(
        (d: any): Data => {
          const id = nanoid(12);
          delete d.id;
          ids.push(id);
          return {
            id,
            ...d,
          };
        },
      );
      await connection.collection(this.collectionName).insertMany(dataArrayMapped, options);
      return ids;
    } catch (error) {
      throw this.database.error(error);
    }
  }

  public async update(
    filter: FilterQuery<Data>,
    update: UpdateQuery<any>,
    options: UpdateManyOptions = {},
  ): Promise<void> {
    this.logger.debugFunctionCall('Model.update', arguments);
    const connection = await this.database.getConnection();
    try {
      if (update.$set) {
        update.$set = dotnotate(update.$set);
      }
      if (update.$unset) {
        update.$unset = dotnotate(update.$unset);
      }
      await connection.collection(this.collectionName).updateMany(filter, JSON.parse(JSON.stringify(update)), options);
    } catch (error) {
      throw this.database.error(error);
    }
  }

  public async delete(filter: FilterQuery<Data>, options: CommonOptions = {}): Promise<void> {
    this.logger.debugFunctionCall('Model.delete', arguments);
    const connection = await this.database.getConnection();
    try {
      await connection.collection(this.collectionName).deleteMany(filter, options);
    } catch (error) {
      throw this.database.error(error);
    }
  }
}
