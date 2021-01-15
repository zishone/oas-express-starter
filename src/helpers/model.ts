import {
  CommonOptions,
  CountOptions,
  Cursor,
  Database,
  FetchOptions,
  Filter,
  SaveOptions,
  Update,
  UpdateOptions,
} from '.';
import { IsNumber, IsOptional, IsString, validateOrReject } from 'class-validator';
import { ERROR_CODES } from '../constants';
import { Logger } from '@zishone/logan';
import { dotnotate } from '@zishone/dotnotate';
import httpError from 'http-errors';
import { nanoid } from 'nanoid';

export class Data {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsNumber()
  createdOn: number;
}

export class Model<T = Data> {
  protected logger: Logger;
  private database: Database;
  private collectionName: string;

  constructor(logger: Logger, database: Database, collectionName: string) {
    this.logger = logger;
    this.database = database;
    this.collectionName = collectionName;
  }

  private async validate(data: Partial<T> | Partial<T>[]): Promise<Partial<T>[]> {
    try {
      this.logger.debugFunctionCall('Model.validate', arguments);
      if (Array.isArray(data)) {
        await Promise.all(data.map((d: object): Promise<void> => validateOrReject(d)));
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
    this.logger.debugFunctionCall('Model.count', arguments);
    const connection = await this.database.getConnection();
    try {
      return await connection.collection(this.collectionName).countDocuments(filter, options);
    } catch (error) {
      throw this.database.error(error);
    }
  }

  public async fetch(filter: Filter<T> = {}, options: FetchOptions<any> = {}): Promise<Cursor<T>> {
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

  public async fetchOne(filter: Filter<T> = {}, options: FetchOptions<any> = {}): Promise<T> {
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

  public async save(data: Partial<T> | Partial<T>[], options: SaveOptions = {}): Promise<string[]> {
    this.logger.debugFunctionCall('Model.save', arguments);
    const dataArray = await this.validate(data);
    const connection = await this.database.getConnection();
    try {
      const ids: string[] = [];
      await connection.collection(this.collectionName).insertMany(
        dataArray.map(
          (d: T): T => {
            const id = nanoid();
            ids.push(id);
            return {
              ...d,
              id,
              createdOn: Date.now(),
            };
          },
        ),
        options,
      );
      return ids;
    } catch (error) {
      throw this.database.error(error);
    }
  }

  public async update(filter: Filter<T>, update: Update<any>, options: UpdateOptions = {}): Promise<void> {
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

  public async delete(filter: Filter<T>, options: CommonOptions = {}): Promise<void> {
    this.logger.debugFunctionCall('Model.delete', arguments);
    const connection = await this.database.getConnection();
    try {
      await connection.collection(this.collectionName).deleteMany(filter, options);
    } catch (error) {
      throw this.database.error(error);
    }
  }
}
