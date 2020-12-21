import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import { ERROR_CODES } from '../constants';
import { HttpError } from 'http-errors';

export const errorMiddleware = (): ErrorRequestHandler => {
  return (error: HttpError | any, _req: Request, res: Response, _next: NextFunction): void => {
    res.status(error.status || 500)
      .send({
        status: error.status < 500 ? 'fail' : 'error',
        message: error.status < 500 ? undefined : error.message || 'Error unknown',
        code: error.code,
        data: {
          errorCode: error.errorCode || ERROR_CODES.UNKNOWN_ERROR,
          message: error.status < 500 ? error.message || 'Error unknown' : undefined,
          details: Array.isArray(error.details) ? error.details : [error.details],
        },
      });
  };
};
