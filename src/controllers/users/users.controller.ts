import { NextFunction, Request, Response } from 'express';
import { NoteService, UserService } from '../../services';
import { EVENTS } from '../../constants';
import { paginate } from '../../utils';

/**
 * GET /api/v1/users
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.mongo);

    const { filter, options } = req.mquery;

    const { userCount, users } = await userService.fetchUsers(filter, options);
    const pagination = paginate(userCount, options.limit);

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
export const getUsersById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.mongo);

    const { userId } = req.params;
    const { options } = req.mquery;

    const { user } = await userService.fetchUserById(userId, options);

    res.jsend.success({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/users/{userId}
 */
export const patchUsersById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.mongo);

    const { userId } = req.params;
    const { username, email, password, name } = req.body;

    await userService.updateUserById(userId, {
      username,
      email,
      password,
      name,
    });

    req.io.to(userId).emit(EVENTS.NOTIFICATION, { message: 'Info updated by admin' });

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/users/{userId}
 */
export const deleteUsersById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.mongo);
    const noteService = new NoteService(req.logger, req.mongo);

    const { userId } = req.params;

    await userService.deleteUserById(userId);
    await noteService.deleteNotes({ userId });

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};
