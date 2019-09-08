import { MongoManager } from '../../helpers';

declare module 'express' {
  interface Request {
    mongo: MongoManager;
    swagger: {
      params: any;
    };
  }

  interface Response {
    jsend: {
      success: (data: any, statusCode?: number) => void;
      fail: (data: any, statusCode?: number) => void;
      error: (error: Error, statusCode?: number) => void;
    };
  }
}