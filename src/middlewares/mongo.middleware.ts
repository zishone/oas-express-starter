import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Mongo } from '../helpers';

export const mongoMiddleware = (mongo: Mongo): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.mongo = mongo;
    next();
  };
};
