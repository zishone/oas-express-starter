import { NextFunction, Request, RequestHandler, Response } from 'express';
import { EventEmitter } from 'events';

export const emitterMiddleware = (emitter: EventEmitter): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.emitter = emitter;
    next();
  };
};
