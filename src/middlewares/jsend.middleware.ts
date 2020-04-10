import {
  NextFunction,
  Request,
  Response,
} from 'express';

export const jsendMiddleware = (): any => {
  return (_: Request, res: Response, next: NextFunction): void => {
    res.jsend = {
      success: (data: any, statusCode?: number): void => {
        res.status(statusCode || 200)
          .send({
            status: 'success',
            data,
          });
      },
      fail: (data: any, statusCode?: number): void => {
        res.status(statusCode || 400)
          .send({
            status: 'fail',
            data,
          });
      },
      error: (message: string, code?: number, data?: any, statusCode?: number): void => {
        res.status(statusCode || 500)
          .send({
            status: 'error',
            message,
            code,
            data,
          });
      },
    };
    next();
  };
};
