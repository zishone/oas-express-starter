import {
  ERROR_CODES,
  STATES,
} from '../constants';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { Logger } from '../helpers';

const logger = new Logger('middleware', __filename);

export const roleMiddleware = (...roles: string[]): any => {
  return (req: Request, _: Response, next: NextFunction): void => {
    logger.debug(req.id, 'roleMiddleware', STATES.BEGUN);
    if (roles && roles.length > 0 && !roles.includes(req.user.role)) {
      next({
        status: 403,
        errors: [{
          errorCode: ERROR_CODES.UNAUTHORIZED,
          keys: ['role'],
          message: `Role ${req.user.role} is not allowed to use this resource.`,
        }],
      });
    } else {
      logger.debug(req.id, 'roleMiddleware', STATES.SUCCEEDED);
      next();
    }
  };
};
