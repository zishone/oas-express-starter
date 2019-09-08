import bluebird = require('bluebird');
import {
  NextFunction,
  Request,
  Response,
} from 'express';

export const composeMiddlewares = (...middlewares: any[]): (req: Request, res: Response, next: NextFunction) => void => {
  return (req: Request, res: Response, next: NextFunction) => {
    bluebird
      .map(middlewares, async (middleware) => {
        await new Promise((resolve, reject) => {
          middleware(req, res, (error: Error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      }, { concurrency: 1 })
      .then(() => {
        next();
      })
      .catch((error: Error) => {
        next(error);
      });
  };
};
