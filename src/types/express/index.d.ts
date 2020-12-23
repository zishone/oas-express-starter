import {
  FilterQuery,
  FindOneOptions,
} from 'mongodb';
import {
  Logger,
  Mongo,
} from '../../helpers';
import { User } from '../../models';

declare module 'express' {
  interface Request {
    id: string;
    logger: Logger;
    mongo: Mongo;
    mquery: {
      filter: FilterQuery<any>;
      options: FindOneOptions<any>;
    };
    user: User;
    logArgs: { [key: string]: any };
  }

  interface Response {
    jsend: {
      success: (data: any, statusCode?: number) => void;
      fail: (data: any, statusCode?: number) => void;
      error: (message: string, code?: number, data?: any, statusCode?: number) => void;
    };
  }
}