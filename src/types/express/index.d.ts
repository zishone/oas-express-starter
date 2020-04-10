import { MongoManager } from '../../helpers';

declare module 'express' {
  interface Request {
    mongo: MongoManager;
    id: string;
  }

  interface Response {
    jsend: {
      success: (data: any, statusCode?: number) => void;
      fail: (data: any, statusCode?: number) => void;
      error: (message: string, code?: number, data?: any, statusCode?: number) => void;
    };
  }
}