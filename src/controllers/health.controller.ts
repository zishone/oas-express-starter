import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { Logger } from '../helpers';
import { HealthCheckService } from '../services';

const logger = new Logger('controller', __filename);

/**
 * GET /api/v1/auth/health
 * Health
 */
export const healthController = async (req: Request, res: Response , _: NextFunction) => {
  try {
    logger.begun(req.id, 'healthController');
    const health = await new HealthCheckService(req.mongo).getHealth();
    res.jsend.success(health);
    logger.succeeded(req.id, 'healthController');
  } catch (error) {
    logger.errored(req.id, 'healthController', error);
    res.jsend.error(error.message);
  }
};
