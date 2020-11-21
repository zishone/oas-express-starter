import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { EventEmitter } from 'events';

export const emmiterMiddleware = (emmiter: EventEmitter): any => {
  return (req: Request, _: Response, next: NextFunction): void => {
    req.emmiter = emmiter;
    next();
  };
};
