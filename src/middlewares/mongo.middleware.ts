import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { MongoManager } from '../helpers';

export const mongoMiddleware = (mongo: MongoManager): any => {
  return (req: Request, _: Response, next: NextFunction): void => {
    req.mongo = mongo;
    next();
  };
};
