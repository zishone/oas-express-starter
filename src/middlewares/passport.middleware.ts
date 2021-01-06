import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { User, UserModel } from '../models';
import { ERROR_CODES } from '../constants';
import { Logger } from '@zishone/logan';
import { Mongo } from '../helpers';
import { config } from '../config';
import httpError from 'http-errors';
import passport from 'passport';

export const passportMiddleware = (logger: Logger, mongo: Mongo): RequestHandler => {
  const userModel = new UserModel(logger, mongo);
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.LOGIN_SECRET,
  };
  const strategy = new Strategy(
    options,
    async ({ id }: { id: string }, done: VerifiedCallback): Promise<void> => {
      try {
        const user = await userModel.fetchOne({ id }, { projection: { password: 0 } });
        done(null, user);
      } catch (error) {
        done(error);
      }
    },
  );
  passport.use(strategy);
  passport.serializeUser((user, done): void => {
    done(null, user);
  });
  passport.deserializeUser((user, done): void => {
    done(null, user);
  });
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    passport.authenticate('jwt', { session: false }, (error: any, user: User, info: any): void => {
      try {
        if (error) {
          throw error;
        }
        if (!user) {
          throw new Error();
        } else {
          req.logIn(user, (error: any): void => {
            if (error) {
              throw error;
            }
            next();
          });
        }
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
