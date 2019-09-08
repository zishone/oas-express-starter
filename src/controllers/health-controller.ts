import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { Logger } from '../helpers';

const logger = new Logger('controller', __filename);

export const healthController = async (req: Request, res: Response , _: NextFunction) => {
  logger.begun('healthController');
  res.jsend.success({
    health: 'Alive!',
  });
};
