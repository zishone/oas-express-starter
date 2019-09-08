import bluebird = require('bluebird');
import {
  NextFunction,
  Request,
  Response,
} from 'express';

export class MiddlewareChain {
  private middlewares: any[];

  constructor(...middlewares: any[]) {
    this.middlewares = middlewares;
  }

  public getHandler(): any {
    return (req: Request, res: Response, next: NextFunction) => {
      bluebird
        .map(this.middlewares, async (middleware) => {
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
  }
}
