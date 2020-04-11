import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { Logger } from '../helpers';
import { AuthService } from '../services';

const logger = new Logger('controller', __filename);

/**
 * POST /api/v1/auth/register
 * Register
 */
export const registerController = async (req: Request, res: Response , _: NextFunction) => {
  try {
    logger.info(req.id, 'registerController', 'begun');
    const newUser = req.body;
    const authService = new AuthService(req.id, req.mongo);
    const user = await authService.register(newUser);
    if (authService.fail) {
      logger.error(req.id, 'registerController', authService.fail);
      res.jsend.fail(authService.fail);
      return;
    }
    logger.info(req.id, 'registerController', 'succeeded');
    res.jsend.success(user);
  } catch (error) {
    logger.fatal(req.id, 'registerController', error);
    res.jsend.error(error.message);
  }
};

/**
 * POST /api/v1/auth/login
 * Login
 */
export const loginController = async (req: Request, res: Response , _: NextFunction) => {
  try {
    logger.info(req.id, 'loginController', 'begun');
    const credentials = req.body;
    const authService = new AuthService(req.id, req.mongo);
    const result = await authService.login(credentials);
    if (authService.fail) {
      logger.error(req.id, 'loginController', authService.fail);
      res.jsend.fail(authService.fail);
      return;
    }
    logger.info(req.id, 'loginController', 'succeeded');
    res.cookie('refresh', result.refreshToken);
    res.jsend.success({ bearerToken: `Bearer ${result.bearerToken}` });
  } catch (error) {
    logger.fatal(req.id, 'loginController', error);
    res.jsend.error(error.message);
  }
};

/**
 * POST /api/v1/auth/refresh
 * Refresh
 */
export const refreshController = async (req: Request, res: Response , _: NextFunction) => {
  try {
    logger.info(req.id, 'refreshController', 'begun');
    const authService = new AuthService(req.id, req.mongo);
    const refreshToken = req.cookies['refresh'];
    if (!refreshToken) {
      const data = { refresh: 'Cookie not found.' };
      logger.error(req.id, 'refreshController', data);
      res.jsend.fail(data);
      return;
    }
    const result = await authService.refresh(refreshToken);
    if (authService.fail) {
      logger.error(req.id, 'refreshController', authService.fail);
      res.jsend.fail(authService.fail);
      return;
    }
    logger.info(req.id, 'refreshController', 'succeeded');
    res.cookie('refresh', result.refreshToken);
    res.jsend.success({ bearerToken: `Bearer ${result.bearerToken}` });
  } catch (error) {
    logger.fatal(req.id, 'refreshController', error);
    res.jsend.error(error.message);
  }
};
