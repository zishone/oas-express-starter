import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { nanoid } from 'nanoid';

export const requestIdMiddleware = (): any => {
  return (req: Request, _: Response, next: NextFunction): void => {
    req.id = nanoid(20);
    next();
  };
};
