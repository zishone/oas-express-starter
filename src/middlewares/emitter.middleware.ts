import { NextFunction, Request, RequestHandler, Response } from 'express';
import { EventEmitter } from 'events';

export const emitterMiddleware = (emitter: EventEmitter): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.emitter = emitter;
      next();
    } catch (error) {
      next(error);
    }
  };
};
