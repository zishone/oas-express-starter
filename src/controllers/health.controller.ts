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
    logger.info(req.id, 'healthController', 'begun');
    const healthCheckService = new HealthCheckService(req.id, req.mongo);
    const health = await healthCheckService.getHealth();
    res.jsend.success(health);
    logger.info(req.id, 'healthController', 'succeeded');
  } catch (error) {
    logger.fatal(req.id, 'healthController', error);
    res.jsend.error(error.message);
  }
};
