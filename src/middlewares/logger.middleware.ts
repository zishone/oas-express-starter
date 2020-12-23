import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { Logger } from '../helpers';
import auth from 'basic-auth';
import onFinished from 'on-finished';
import onHeaders from 'on-headers';

export const loggerMiddleware = (logger: Logger): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const logData: { [key: string]: any } = {};
    req.addLogData = (data: { [key: string]: any }): void => {
      for (const key in data) {
        logData[key] = data[key];
      }
    };
    req.logger = logger;
    let responseStartTime = 0;
    onHeaders(res, (): void => {
      responseStartTime = Date.now();
    });
    onFinished(res, (): void => {
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
        'response.time': endTime - responseStartTime,
        'data': logData,
      });
    });
    next();
  };
};
