import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ERROR_CODES } from '../constants';
import httpError from 'http-errors';

export const roleMiddleware = (...roles: string[]): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (roles && roles.length > 0 && !roles.includes(req.user.role)) {
        throw httpError(403, 'Role not allowed', { errorCode: ERROR_CODES.UNAUTHORIZED });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
