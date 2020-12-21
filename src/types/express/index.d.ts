import {
  FilterQuery,
  FindOneOptions,
} from 'mongodb';
import {
  Logger,
  Mongo,
} from '../../helpers';
import { EventEmitter } from 'events';

declare module 'express' {
  interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    role: string;
    createdOn: number;
  }

  interface Request {
    id: string;
    logger: Logger;
    mongo: Mongo;
    emitter: EventEmitter;
    mquery: {
      filter: FilterQuery<any>;
      options: FindOneOptions<any>;
      isPaginated: boolean;
    };
    user: User;
  }

  interface Response {
    jsend: {
      success: (data: any, statusCode?: number) => void;
      fail: (data: any, statusCode?: number) => void;
      error: (message: string, code?: number, data?: any, statusCode?: number) => void;
    };
  }
}