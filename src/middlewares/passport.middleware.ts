import { COLLECTIONS, ERROR_CODES } from '../constants';
import { Database, Model } from '../helpers';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Logger } from '@zishone/logan';
import { User } from '../entities';
import { config } from '../configs';
import httpError from 'http-errors';
import passport from 'passport';

export const passportMiddleware = (logger: Logger, database: Database): RequestHandler => {
  const userModel = new Model<User>(logger, database, COLLECTIONS.USERS);
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
  // passport.deserializeUser((user, done): void => {
  //   done(null, user);
  // });
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
