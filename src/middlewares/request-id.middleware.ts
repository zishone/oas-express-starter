import { NextFunction, Request, RequestHandler, Response } from 'express';
import { nanoid } from 'nanoid';

export const requestIdMiddleware = (): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.id = nanoid(12);
    next();
  };
};
