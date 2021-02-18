import { NextFunction, Request, RequestHandler, Response } from 'express';
import { logConfig } from '../configs';
import { logger } from '../helpers';
import morgan from 'morgan';

export const logMiddleware = (): RequestHandler => {
  morgan.token('id', (req: Request): string => {
    return req.id;
  });

  morgan.token('info', (req: Request): string => {
    return JSON.stringify(req.info);
  });

  morgan.token('error', (req: Request): string => {
    return req.error || '{}';
  });

  return (req: Request, res: Response, next: NextFunction): void => {
    req.info = {};
    morgan(logConfig.MORGAN_FORMAT, { stream: logger })(req, res, next);
  };
};
