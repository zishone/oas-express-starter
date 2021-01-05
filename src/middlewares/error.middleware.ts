import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ERROR_CODES } from '../constants';
import { HttpError } from 'http-errors';

export const errorMiddleware = (): ErrorRequestHandler => {
  return (error: HttpError | any, req: Request, res: Response, _next: NextFunction): void => {
    try {
      req.addLogError(error);
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
            errorCode: error.errorCode || ERROR_CODES.UNKNOWN_ERROR,
            message: error.message || 'Error unknown',
            details: Array.isArray(error.details) ? error.details : [error.details],
          },
          error.status,
        );
        return;
      }
      res.jsend.error(error.message || 'Error unknown', error.status, error.code, {
        errorCode: error.errorCode || ERROR_CODES.UNKNOWN_ERROR,
        details: Array.isArray(error.details) ? error.details : [error.details],
      });
    } catch (error) {
      req.logger.error('Error middleware failed', { error });
    }
  };
};
