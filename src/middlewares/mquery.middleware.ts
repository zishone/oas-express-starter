
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import rsql from 'rsql-mongodb';

export const mqueryMiddleware = (): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.mquery = {
      filter: {},
      options: {},
    };
    try {
      if (typeof req.query.filter === 'string') {
        req.mquery.filter = rsql(req.query.filter);
      }
    } catch (_) {
      // TODO: warn
    }

    req.mquery.options.projection = {};
    if (typeof req.query.fields === 'string') {
      req.query.fields.split(';')
        .forEach((key: string): void => {
          req.mquery.options.projection[key] = 1;
        });
    }

    req.mquery.options.sort = {};
    if (typeof req.query.sort === 'string') {
      req.query.sort.split(';')
        .forEach((sort: string): void => {
          const keyValue = sort.split('==');
          switch (keyValue[1]) {
            case 'desc':
              (req.mquery.options.sort as any)[keyValue[0]] = -1;
              break;
            case 'asc':
            case undefined:
            default:
              // TODO: warn
              (req.mquery.options.sort as any)[keyValue[0]] = 1;
              break;
          }
        });
    }

    req.mquery.options.limit = 0;
    if (typeof req.query.limit === 'string') {
      req.mquery.options.limit = parseFloat(req.query.limit);
    }
    req.mquery.options.skip = 0;
    if (typeof req.query.skip === 'string') {
      req.mquery.options.skip = parseFloat(req.query.skip);
    }

    if (typeof req.query.page === 'string') {
      req.mquery.options.skip = (parseFloat(req.query.page) - 1) * (req.mquery.options.limit || 1);
    }

    next();
  };
};
