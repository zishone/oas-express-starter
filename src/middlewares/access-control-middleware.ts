import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { appConfig } from '../config';

export const accessControlMiddleware = (): RequestHandler => {
  return (_: Request, res: Response, next: NextFunction): void => {
    res.header('Access-Control-Allow-Origin', appConfig.accessControl.allowOrigin);
    res.header('Access-Control-Allow-Credentials', appConfig.accessControl.allowCredentials);
    res.header('Access-Control-Allow-Methods', appConfig.accessControl.allowMethods);
    next();
  };
};
