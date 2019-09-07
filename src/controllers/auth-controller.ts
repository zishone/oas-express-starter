import {
  NextFunction,
  Request,
  Response,
} from 'express';
import passport = require('passport');

export const loginController = async (req: Request, res: Response , next: NextFunction) => {
  try {
    const user: any = await new Promise((resolve, reject) => {
      passport.authenticate('jwt', (error: Error, user: any): void => {
        if (error) {
          reject(error);
        } else {
          resolve(user);
        }
      })(req, res, next);
    });
    await new Promise((resolve, reject) => {
      req.logIn(user, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    next(error);
  }
};
