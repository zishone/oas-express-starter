import {
  ActivityService,
  NoteService,
  UserService,
} from '../../services';
import {
  ERROR_CODES,
  STATES,
} from '../../constants';
import {
  Fail,
  Logger,
} from '../../helpers';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { compareSync } from 'bcryptjs';

const logger = new Logger('controller', __filename);

/**
 * GET /api/v1/user
 */
export const getUser = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'getUser', STATES.BEGUN);
    const userService = new UserService(req.id, req.mongo);

    const { userId } = req.user;
    const { options } = req.mquery;

    const { user } = await userService.fetchUser({ userId }, options)
      .catch((error: any) => {
        throw error;
      });
    delete user.password;

    logger.debug(req.id, 'getUser', STATES.SUCCEEDED);
    res.jsend.success({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/user
 */
export const putUser = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'putUser', STATES.BEGUN);
    const userService = new UserService(req.id, req.mongo);

    const { userId } = req.user;
    const {
      username,
      email,
      name,
    } = req.body;

    await userService.updateUser({ userId }, {
      username,
      email,
      name,
    })
      .catch((error: any) => {
        throw error;
      });

    logger.debug(req.id, 'putUser', STATES.SUCCEEDED);
    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/user
 */
export const deleteUser = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'deleteUser', STATES.BEGUN);
    const userService = new UserService(req.id, req.mongo);
    const noteService = new NoteService(req.id, req.mongo);
    const activityService = new ActivityService(req.id, req.mongo);

    const { userId } = req.user;
    const { password } = req.body;

    const { user } = await userService.fetchUser({ userId }, { projection: { password: 1 } })
      .catch((error: any) => {
        throw error;
      });
    const isMatch = compareSync(password, user.password);
    if (!isMatch) {
      throw new Fail(403)
        .error({
          errorCode: ERROR_CODES.INVALID,
          keys: ['password'],
          message: 'Provided password is invalid.',
        })
        .build();
    }
    await userService.deleteUser({ userId })
      .catch((error: any) => {
        throw error;
      });
    await noteService.deleteNotes({ userId })
      .catch((error: any) => {
        throw error;
      });
    await activityService.deleteActivities({ userId })
      .catch((error: any) => {
        throw error;
      });

    logger.debug(req.id, 'deleteUser', STATES.SUCCEEDED);
    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};


/**
 * PUT /api/v1/user/password
 */
export const putUserPassword = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'putUserPassword', STATES.BEGUN);
    const userService = new UserService(req.id, req.mongo);

    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    const { user } = await userService.fetchUser({ userId }, { projection: { password: 1 } })
      .catch((error: any) => {
        throw error;
      });
    const isMatch = compareSync(currentPassword, user.password);
    if (!isMatch) {
      throw new Fail(403)
        .error({
          errorCode: ERROR_CODES.INVALID,
          keys: ['currentPassword'],
          message: 'Provided current password is invalid.',
        })
        .build();
    }
    await userService.updateUser({ userId }, { password: newPassword })
      .catch((error: any) => {
        throw error;
      });

    logger.debug(req.id, 'putUserPassword', STATES.SUCCEEDED);
    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};
