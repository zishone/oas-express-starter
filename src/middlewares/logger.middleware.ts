import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { Logger } from '../helpers';
import auth from 'basic-auth';

export const loggerMiddleware = (logger: Logger): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.logger = logger;
    const startTime = Date.now();
    req.on('close', () => {
      const endTime = Date.now();
      logger.info('Request finished', {
        'request.id': req.id,
        'request.remote.address': req.ip || (req.connection && req.connection.remoteAddress),
        'request.remote.user': auth(req)?.name,
        'request.timestamp': new Date().toISOString(),
        'request.method': req.method,
        'request.url': req.originalUrl || req.url,
        'request.http.version': req.httpVersionMajor + '.' + req.httpVersionMinor,
        'request.referrer': req.headers.referer || req.headers.referrer,
        'request.user.agent': req.headers['user-agent'],
        'response.status': res.headersSent ? res.statusCode.toString() : undefined,
        'response.content.length': res.headersSent ? res.getHeader('content-length') : undefined,
        'response.time': endTime - startTime,
      });
    });
    next();
  };
};
