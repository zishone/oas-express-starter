
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import rsql = require('rsql-mongodb');
import { Logger } from '../helpers';

const logger = new Logger('middleware', __filename);

export const mqueryMiddleware = (): any => {
  return (req: Request, _: Response, next: NextFunction): void => {
    req.mquery = {
      filter: {},
      options: {},
      isPaginated: false,
    };
    try {
      if (req.query.filter) {
        req.mquery.filter = rsql(req.query.filter);
      }
    } catch (_) {
      logger.warn(req.id, 'rsqlMiddleware', 'Wrong filter syntax.');
    }

    req.mquery.options.projection = {};
    if (req.query.fields) {
      req.query.fields.split(';')
        .forEach((key: string) => {
          req.mquery.options.projection[key] = 1;
        });
    }

    req.mquery.options.sort = {};
    if (req.query.sort) {
      req.query.sort.split(';')
        .forEach((sort: string) => {
          const keyValue = sort.split('==');
          switch (keyValue[1]) {
            case 'desc':
              req.mquery.options.sort[keyValue[0]] = -1;
              break;
            case 'asc':
            case undefined:
            default:
              logger.warn(req.id, 'rsqlMiddleware', 'Wrong sort syntax.');
              req.mquery.options.sort[keyValue[0]] = 1;
              break;
          }
        });
    }

    req.mquery.options.limit = parseFloat(req.query.limit || '0');
    req.mquery.options.skip = parseFloat(req.query.skip || '0');

    if (req.query.page) {
      req.mquery.isPaginated = true;
      req.mquery.options.skip = (parseFloat(req.query.page) - 1) * (req.mquery.options.limit || 1);
    }

    next();
  };
};
