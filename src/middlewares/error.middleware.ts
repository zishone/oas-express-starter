import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ERROR_CODES } from '../constants';
import { HttpError } from 'http-errors';

export const errorMiddleware = (isValidationError: boolean = false): ErrorRequestHandler => {
  return (error: HttpError | any, req: Request, res: Response, _next: NextFunction): void => {
    req.addLogError(error);
    res.status(error.status || 500).send({
      status: error.status < 500 ? 'fail' : 'error',
      message: error.status < 500 ? undefined : error.message || 'Error unknown',
      code: error.code,
      data: {
        errorCode: isValidationError ? ERROR_CODES.INVALID : error.errorCode || ERROR_CODES.UNKNOWN_ERROR,
        message: isValidationError
          ? 'Invalid payload'
          : error.status < 500
          ? error.message || 'Error unknown'
          : undefined,
        details: isValidationError ? error.errors : Array.isArray(error.details) ? error.details : [error.details],
      },
    });
  };
};
