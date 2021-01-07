import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Database } from '../helpers';

export const databaseMiddleware = (database: Database): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.database = database;
    next();
  };
};
