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
    logger.begun('healthController');
    const health = await new HealthCheckService(req.mongo).getHealth();
    res.jsend.success(health);
    logger.succeeded('healthController');
  } catch (error) {
    logger.failed('healthController', error);
    res.jsend.error(error);
  }
};
