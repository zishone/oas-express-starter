import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ERROR_CODES } from '../constants';

export const errorMiddleware = (): ErrorRequestHandler => {
  return (error: any, req: Request, res: Response, _next: NextFunction): void => {
    error.details = Array.isArray(error.details) ? error.details : [error.details];
    req.error = JSON.stringify(error);
    if (error.errors || error.type === 'entity.parse.failed' || error.type === 'mquery.parse.failed') {
      res.jsend.fail({
        errorCode: ERROR_CODES.INVALID,
        message: 'Invalid request',
        details: error.errors,
      });
      return;
    }
    if (error.status < 500) {
      res.jsend.fail(
        {
          errorCode: error.errorCode,
          message: error.message,
          details: error.details,
        },
        error.status,
      );
      return;
    }
    res.jsend.error(error.message, error.status, error.code, {
      errorCode: ERROR_CODES.UNKNOWN_ERROR,
      details: error.details,
    });
  };
};
