import {
  COLLECTIONS,
  ERROR_CODES,
  STATES,
} from '../constants';
import {
  ExtractJwt,
  Strategy,
  VerifiedCallback,
} from 'passport-jwt';
import {
  Fail,
  Logger,
  Mongo,
} from '../helpers';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { config } from '../config';
import passport = require('passport');

const logger = new Logger('middleware', __filename);

export const passportMiddleware = (mongo: Mongo): any => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.LOGIN_SECRET,
  };
  const strategy = new Strategy(options, async (payload: any, done: VerifiedCallback) => {
      try {
        const filter = { userId: payload.userId };
        const projection = { password: 0 };
        const user = await mongo.collection(COLLECTIONS.USERS)
          .findOne(filter, { projection });
        done(null, user);
      } catch (error) {
        done(error);
      }
    },
  );
  passport.use(strategy);
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  return async (req: Request, res: Response, next: NextFunction | any) => {
    logger.debug(req.id, 'passportMiddleware', STATES.BEGUN);
    passport.authenticate('jwt', {session: false}, (error: Error, user: any, info: any): void => {
      try {
        if (error) {
          throw error;
        }
        if (!user) {
          throw new Fail(401)
            .error({
              errorCode: ERROR_CODES.UNAUTHENTICATED,
              keys: 'Authorization',
              message: 'Authentication failed.',
            })
            .error(info)
            .build();
        } else {
          req.logIn(user, (err: Error) => {
            if (err) {
              throw err;
            }
            logger.debug(req.id, 'passportMiddleware', STATES.SUCCEEDED);
            next();
          });
        }
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  };
};
