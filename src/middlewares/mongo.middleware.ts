import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { Mongo } from '../helpers';

export const mongoMiddleware = (mongo: Mongo): any => {
  return (req: Request, _: Response, next: NextFunction): void => {
    req.mongo = mongo;
    next();
  };
};
