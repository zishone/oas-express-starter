import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ERROR_CODES } from '../constants';
import { User } from '../models';
import httpError from 'http-errors';
import passport from 'passport';

export const authenticationMiddleware = (): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    passport.authenticate('jwt', { session: false }, (error: any, user: User, info: object): void => {
      try {
        if (error) {
          throw error;
        }
        if (!user) {
          throw new Error('User not found');
        }
        req.logIn(user, next);
      } catch (error) {
        next(
          httpError(401, 'Authentication failed', {
            errorCode: ERROR_CODES.UNAUTHENTICATED,
            details: [error, info],
          }),
        );
      }
    })(req, res, next);
  };
};
