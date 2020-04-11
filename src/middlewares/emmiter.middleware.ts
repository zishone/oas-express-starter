import { EventEmitter } from 'events';
import {
  NextFunction,
  Request,
  Response,
} from 'express';

export const emmiterMiddleware = (emmiter: EventEmitter): any => {
  return (res: Request, _: Response, next: NextFunction): void => {
    res.emmiter = emmiter;
    next();
  };
};
