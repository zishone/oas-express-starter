
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { Logger } from '../../helpers';
import { STATES } from '../../constants';
import { UserService } from '../../services';

const logger = new Logger('controller', __filename);

/**
 * POST /api/v1/register
 */
export const postRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.debug(req.id, 'postRegister', STATES.BEGUN);
    const userService = new UserService(req.id, req.mongo);

    const {
      username,
      email,
      password,
      name,
    } = req.body;

    const { userId } = await userService.addUser(username, email, password, name)
      .catch((error: any) => {
        throw error;
      });
    const { user } = await userService.fetchUser({ userId }, { projection: { password: 0 } })
      .catch((error: any) => {
        throw error;
      });

    logger.debug(req.id, 'postRegister', STATES.SUCCEEDED);
    res.jsend.success({ user }, 201);
  } catch (error) {
    next(error);
  }
};
