import { MongoManager } from '../../helpers';
import { EventEmitter } from 'events';

declare module 'express' {
  interface Request {
    mongo: MongoManager;
    id: string;
    emmiter: EventEmitter;
  }

  interface Response {
    jsend: {
      success: (data: any, statusCode?: number) => void;
      fail: (data: any, statusCode?: number) => void;
      error: (message: string, code?: number, data?: any, statusCode?: number) => void;
    };
  }
}