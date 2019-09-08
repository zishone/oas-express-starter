import {
  NextFunction,
  Request,
  Response,
} from 'express';
import passport = require('passport');

export const authenticateMiddleware = (): any => {
  return (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('jwt', {session: false}, (error: Error, user: any, info: any): void => {
      if (error) {
        next(error);
      } else if (!user) {
        console.log('no user');
        res.jsend.fail({
          Authorization: 'Authentication failed.',
        });
      } else {
        req.logIn(user, (err) => {
          if (err) {
            next(err);
          } else {
            next();
          }
        });
      }
    })(req, res, next);
  };
};
