import {
  NextFunction,
  Request,
  RequestHandler,
} from 'express';

export const jsendMiddleware = (): RequestHandler => {
  return (_: Request, res: any, next: NextFunction): void => {
    res.jsend = {
      success: (data: any, statusCode?: number): void => {
        res
          .status(statusCode || 200)
          .send({
            status: 'success',
            data,
          });
      },
      fail: (data: any, statusCode?: number): void => {
        res
          .status(statusCode || 400)
          .send({
            status: 'fail',
            data,
          });
      },
      error: (error: Error, statusCode?: number): void => {
        res
          .status(statusCode || 500)
          .send({
            status: 'error',
            data: error,
            message: error.message,
            code: error.name,
          });
      },
    };
    next();
  };
};
