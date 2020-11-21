import { Mongo } from '../../helpers';
import { EventEmitter } from 'events';

declare module 'express' {
  interface Request {
    mongo: Mongo;
    id: string;
    emmiter: EventEmitter;
    mquery: {
      filter: any;
      options: any;
      isPaginated: boolean;
    };
    user: {
      userId: string;
      username: string;
      email: string;
      name: string;
      role: string;
      createdOn: number;
    };
  }

  interface Response {
    jsend: {
      success: (data: any, statusCode?: number) => void;
      fail: (data: any, statusCode?: number) => void;
      error: (message: string, code?: number, data?: any, statusCode?: number) => void;
    };
  }
}