import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { User, UserModel } from '../models';
import { ERROR_CODES } from '../constants';
import { config } from '../config';
import httpError from 'http-errors';
import passport from 'passport';

export const passportMiddleware = (userModel: UserModel): RequestHandler => {
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
    passport.authenticate('jwt', { session: false }, (error: Error, user: User, info: any): void => {
      try {
        if (error) {
          throw error;
        }
        if (!user) {
          throw new Error();
        } else {
          req.logIn(user, (err: Error): void => {
            if (err) {
              throw err;
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
