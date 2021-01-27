import { NextFunction, Request, RequestHandler, Response } from 'express';
import { appConfig } from '../configs';
import { nanoid } from 'nanoid';

export const requestIdMiddleware = (): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.id = nanoid(appConfig.DATA_ID_LENGTH);
    next();
  };
};
