import {
  NextFunction,
  RequestHandler,
  Response,
} from 'express';
import { AppContext } from '../types';

export const contextMiddleware = (context: AppContext): RequestHandler => {
  return (req: any, _: Response, next: NextFunction): void => {
    req.context = context;
    next();
  };
};
