import {
  NextFunction,
  Request,
  Response,
} from 'express';

export const errorHandlerMiddleware = (): any => {
  return (error: Error, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
      next(error);
    } else {
      res.jsend.error(error);
    }
  };
};
