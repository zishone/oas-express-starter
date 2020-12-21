import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { Logger } from '../helpers';

export const loggerMiddleware = (logger: Logger): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.logger = logger;
    next();
  };
};
