import {
  CommonOptions,
  CountOptions,
  Cursor,
  FetchOptions,
  Filter,
  SaveOptions,
  Update,
  UpdateOptions,
  database,
  logger,
} from '.';
import { Data } from '../models';
import { ERROR_CODES } from '../constants';
import { dotnotate } from '@zishone/dotnotate';
import httpError from 'http-errors';
import { nanoid } from 'nanoid';
import { validateOrReject } from 'class-validator';

export class Model<T extends Data> {
  constructor(private collectionName: string) {}

  private async validate(data: Partial<T> | Partial<T>[]): Promise<Partial<T>[]> {
    try {
      logger.debugFunctionCall('Model.validate', arguments);
      if (Array.isArray(data)) {
        await Promise.all(data.map((d: T): Promise<void> => validateOrReject(d)));
        return data;
      } else {
        await validateOrReject(data);
        return [data];
      }
    } catch (error) {
      throw httpError(400, 'Data invalid', {
        errorCode: ERROR_CODES.INVALID,
        details: error,
      });
    }
  }

  public async count(filter: Filter<T> = {}, options: CountOptions = {}): Promise<number> {
    logger.debugFunctionCall('Model.count', arguments);
    const connection = await database.getConnection();
    try {
      return await connection.collection(this.collectionName).countDocuments(filter, options);
    } catch (error) {
      throw database.error(error);
    }
  }

  public async fetch(filter: Filter<T> = {}, options: FetchOptions<any> = {}): Promise<Cursor<T>> {
    logger.debugFunctionCall('Model.fetch', arguments);
    const connection = await database.getConnection();
    try {
      options.projection = {
        _id: 0,
        ...(options.projection || {}),
      };
      const cursor = connection.collection(this.collectionName).find(filter, options);
      return cursor;
    } catch (error) {
      throw database.error(error);
    }
  }

  public async fetchOne(filter: Filter<T> = {}, options: FetchOptions<any> = {}): Promise<T> {
    logger.debugFunctionCall('Model.fetchOne', arguments);
    const connection = await database.getConnection();
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
      throw database.error(error);
    }
  }

  public async save(data: T | T[], options: SaveOptions = {}): Promise<string[]> {
    logger.debugFunctionCall('Model.save', arguments);
    const dataArray = await this.validate(data);
    const connection = await database.getConnection();
    try {
      const ids: string[] = [];
      await connection.collection(this.collectionName).insertMany(
        dataArray.map(
          (d: T): T => {
            const id = nanoid(12);
            ids.push(id);
            return {
              ...d,
              id,
              modifiedOn: 0,
              createdOn: Date.now(),
            };
          },
        ),
        options,
      );
      return ids;
    } catch (error) {
      throw database.error(error);
    }
  }

  public async update(filter: Filter<T>, update: Update<any>, options: UpdateOptions = {}): Promise<void> {
    logger.debugFunctionCall('Model.update', arguments);
    const connection = await database.getConnection();
    try {
      if (update.$set) {
        update.$set = {
          ...dotnotate(update.$set),
          modifiedOn: Date.now(),
        };
      } else {
        update.$set = { modifiedOn: Date.now() };
      }
      if (update.$unset) {
        update.$unset = dotnotate(update.$unset);
      }
      await connection.collection(this.collectionName).updateMany(filter, JSON.parse(JSON.stringify(update)), options);
    } catch (error) {
      throw database.error(error);
    }
  }

  public async delete(filter: Filter<T>, options: CommonOptions = {}): Promise<void> {
    logger.debugFunctionCall('Model.delete', arguments);
    const connection = await database.getConnection();
    try {
      await connection.collection(this.collectionName).deleteMany(filter, options);
    } catch (error) {
      throw database.error(error);
    }
  }
}
