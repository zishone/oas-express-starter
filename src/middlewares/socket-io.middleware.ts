import { NextFunction, Request, RequestHandler, Response } from 'express';
import { SocketIO } from '../helpers';

export const socketIOMiddleware = (socketIO: SocketIO): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.socketIO = socketIO;
    next();
  };
};
