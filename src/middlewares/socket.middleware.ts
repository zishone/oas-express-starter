import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Socket } from '../helpers';

export const socketMiddleware = (socket: Socket): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.io = socket;
    next();
  };
};
