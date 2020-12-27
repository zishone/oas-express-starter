import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ERROR_CODES } from '../constants';
import { HttpError } from 'http-errors';

export const errorMiddleware = (): ErrorRequestHandler => {
  return (error: HttpError | any, req: Request, res: Response, _next: NextFunction): void => {
    req.addLogError(error);
    if (error.errors || error.type === 'entity.parse.failed') {
      res.jsend.fail(
        {
          errorCode: ERROR_CODES.INVALID,
          message: 'Invalid payload',
          details: error.errors,
        },
        error.status,
      );
      return;
    }
    if (error.status < 500) {
      res.jsend.fail(
        {
          errorCode: error.errorCode || ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || 'Error unknown',
          details: Array.isArray(error.details) ? error.details : [error.details],
        },
        error.status,
      );
      return;
    }
    res.jsend.error(
      error.message || 'Error unknown',
      error.code,
      {
        errorCode: error.errorCode || ERROR_CODES.UNKNOWN_ERROR,
        details: Array.isArray(error.details) ? error.details : [error.details],
      },
      error.status,
    );
  };
};
