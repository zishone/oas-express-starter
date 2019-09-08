import {
  NextFunction,
  Request,
  Response,
} from 'express';

export const errorHandlerMiddleware = (): any => {
  return (error: Error, _: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
      next(error);
    } else {
      res
        .status(500)
        .send({
          status: 'error',
          message: error.message,
        });
    }
  };
};
