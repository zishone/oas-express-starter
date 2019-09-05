import passport = require('passport');
import { Logger } from '../helpers/Logger';
import {
  Request,
  Response,
} from '../types';

const log = new Logger(__filename);

export const loginController = async (req: Request, res: Response , next: any) => {
  try {
    log.info('Logging in ...');
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
    log.error('Error while logging in user %O', error);
    res.jsend.error(error);
  }
};
