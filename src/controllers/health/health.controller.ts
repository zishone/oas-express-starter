import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../helpers';
import { STATES } from '../../constants';
import { config } from '../../config';

const logger = new Logger('controller', __filename);

/**
 * GET /health
 */
export const getHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.debug(req.id, 'getHealth', STATES.BEGUN);

    await req.mongo.getDb();

    logger.debug(req.id, 'getHealth', STATES.SUCCEEDED);
    res.jsend.success({
      name: config.APP_NAME,
      version: config.APP_VERSION,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
