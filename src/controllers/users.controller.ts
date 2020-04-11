import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { Logger } from '../helpers';
import { UsersService } from '../services';

const logger = new Logger('controller', __filename);

/**
 * GET /api/v1/auth/users/{username}
 * Get User
 */
export const getUserController = async (req: Request, res: Response, _: NextFunction) => {
  try {
    logger.info(req.id, 'getUserController', 'begun');
    const username = req.params.username;
    const usersService = new UsersService(req.id, req.mongo);
    const user = await usersService.getUser(username);
    if (usersService.fail) {
      logger.error(req.id, 'getUserController', usersService.fail);
      res.jsend.fail(usersService.fail);
      return;
    }
    logger.info(req.id, 'getUserController', 'succeeded');
    res.jsend.success(user);
  } catch (error) {
    logger.fatal(req.id, 'getUserController', error);
    res.jsend.error(error.message);
  }
};

/**
 * PUT /api/v1/auth/users/{username}
 * Update User
 */
export const updateUserController = async (req: Request, res: Response, _: NextFunction) => {
  try {
    logger.info(req.id, 'updateUserController', 'begun');
    const username = req.params.username;
    const update = req.body;
    const usersService = new UsersService(req.id, req.mongo);
    const user = await usersService.updateUser(username, update);
    if (usersService.fail) {
      logger.error(req.id, 'updateUserController', usersService.fail);
      res.jsend.fail(usersService.fail);
      return;
    }
    logger.info(req.id, 'updateUserController', 'succeeded');
    res.jsend.success(user);
  } catch (error) {
    logger.fatal(req.id, 'updateUserController', error);
    res.jsend.error(error.message);
  }
};

/**
 * DELETE /api/v1/auth/users/{username}
 * Delete User
 */
export const deleteUserController = async (req: Request, res: Response, _: NextFunction) => {
  try {
    logger.info(req.id, 'deleteUserController', 'begun');
    const username = req.params.username;
    const usersService = new UsersService(req.id, req.mongo);
    const user = await usersService.deleteUser(username);
    if (usersService.fail) {
      logger.error(req.id, 'deleteUserController', usersService.fail);
      res.jsend.fail(usersService.fail);
      return;
    }
    logger.info(req.id, 'deleteUserController', 'succeeded');
    res.jsend.success(user);
  } catch (error) {
    logger.info(req.id, 'deleteUserController', error);
    res.jsend.error(error.message);
  }
};
