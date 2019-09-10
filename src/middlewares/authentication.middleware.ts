import {
  NextFunction,
  Request,
  Response,
} from 'express';
import passport = require('passport');

export const authenticationMiddleware = (): any => {
  return (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('jwt', {session: false}, (error: Error, user: any, _: any): void => {
      try {
        if (error) {
          throw error;
        } else if (!user) {
          res.jsend.fail({
            Authorization: 'Authentication failed.',
          }, 401);
        } else {
          req.logIn(user, (err) => {
            if (err) {
              throw err;
            } else {
              next();
            }
          });
        }
      } catch (error) {
        res.jsend.error(error);
      }
    })(req, res, next);
  };
};
