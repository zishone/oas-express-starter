import {
  NextFunction,
  Request,
  Response,
} from 'express';
import passport = require('passport');
import { Logger } from '../helpers';

const logger = new Logger('controller', __filename);

export const authMiddleware = (): any => {
  return async (req: Request, res: Response, next: NextFunction) => {
    logger.debug(req.id, 'authMiddleware', 'begun');
    return await new Promise((resolve, reject) => {
      passport.authenticate('jwt', {session: false}, (error: Error, user: any, _: any): void => {
        try {
          if (error) {
            throw error;
          } else if (!user) {
            const data = { Authorization: 'Authentication failed.' };
            logger.error(req.id, 'authMiddleware', data);
            res.jsend.fail(data);
          } else {
            req.logIn(user, (err: Error) => {
              if (err) {
                throw err;
              } else {
                logger.debug(req.id, 'authMiddleware', 'succeeded');
                resolve(true);
              }
            });
          }
        } catch (error) {
          logger.fatal(req.id, 'authMiddleware', error);
          reject(error);
        }
      })(req, res, next);
    });
  };
};
