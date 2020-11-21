import {
  Request,
  Response,
} from 'express';
import { Logger } from '../helpers';

const logger = new Logger('middleware', __filename);

export const errorMiddleware = (): any => {
  return (error: any, req: Request, res: Response): void => {
    const payload: any = {};
    if (error.status >= 400 && error.status < 500) {
      logger.error(req.id, 'errorMiddleware', error.errors);
      payload.status = 'fail';
      payload.data = error.errors ? { details: error.errors } : undefined;
      res.status(error.status)
        .send(payload);
    } else {
      logger.fatal(req.id, 'errorMiddleware', error);
      payload.status = 'error';
      payload.message = error.message || 'Unknown error.',
      payload.code = error.code,
      payload.data = error.errors ? { details: error.errors } : undefined;
      res.status(error.status || 500)
        .send(payload);
    }
  };
};
