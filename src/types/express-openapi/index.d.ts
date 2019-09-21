import {
  Response,
  NextFunction
} from 'express';

declare module 'express-openapi' {
  interface Request {
    res: Response,
    next: NextFunction,
  }

  namespace OpenAPI {
    interface Request {
      res: Response,
      next: NextFunction,
    }
  }
}