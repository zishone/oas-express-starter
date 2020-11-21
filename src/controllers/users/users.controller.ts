import {
  ActivityService,
  NoteService,
  UserService,
} from '../../services';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { Logger } from '../../helpers';
import { STATES } from '../../constants';

const logger = new Logger('controller', __filename);

/**
 * GET /api/v1/users
 */
export const getUsers = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'getUsers', STATES.BEGUN);
    const userService = new UserService(req.id, req.mongo);

    const { filter, options, isPaginated } = req.mquery;

    const pagination: any = {};
    if (isPaginated) {
      const { userCount } = await userService.countUsers(filter);
      pagination.totalItemCount = userCount;
    }
    const { users } = await userService.fetchUsers(filter, options)
      .catch((error: any) => {
        throw error;
      });
    for (const user of users) {
      delete user.password;
    }

    logger.debug(req.id, 'getUsers', STATES.SUCCEEDED);
    res.jsend.success({
      pagination,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/users/{userId}
 */
export const getUsersById = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'getUsersById', STATES.BEGUN);
    const userService = new UserService(req.id, req.mongo);

    const { userId } = req.params;
    const { options } = req.mquery;

    const { user } = await userService.fetchUser({ userId }, options)
      .catch((error: any) => {
        throw error;
      });
    delete user.password;

    logger.debug(req.id, 'getUsersById', STATES.SUCCEEDED);
    res.jsend.success({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/users/{userId}
 */
export const putUsersById = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'putUsersById', STATES.BEGUN);
    const userService = new UserService(req.id, req.mongo);

    const { userId } = req.params;
    const {
      username,
      email,
      password,
      name,
    } = req.body;

    await userService.fetchUser({ userId })
      .catch((error: any) => {
        throw error;
      });
    await userService.updateUser({ userId }, {
      username,
      email,
      password,
      name,
    })
      .catch((error: any) => {
        throw error;
      });

    logger.debug(req.id, 'putUsersById', STATES.SUCCEEDED);
    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/users/{userId}
 */
export const deleteUsersById = async (req: Request, res: Response , next: NextFunction) => {
  try {
    logger.debug(req.id, 'deleteUsersById', STATES.BEGUN);
    const userService = new UserService(req.id, req.mongo);
    const noteService = new NoteService(req.id, req.mongo);
    const activityService = new ActivityService(req.id, req.mongo);

    const { userId } = req.params;

    await userService.fetchUser({ userId })
      .catch((error: any) => {
        throw error;
      });
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

    logger.debug(req.id, 'deleteUsersById', STATES.SUCCEEDED);
    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};
