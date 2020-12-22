import {
  NextFunction,
  Request,
  Response,
} from 'express';
import {
  NoteService,
  UserService,
} from '../../services';

/**
 * GET /api/v1/users
 */
export const getUsers = async (req: Request, res: Response , next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.mongo);

    const { filter, options } = req.mquery;

    const users = await userService.fetchUsers(filter, options);

    res.jsend.success({ users });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/users/{id}
 */
export const getUsersById = async (req: Request, res: Response , next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.mongo);

    const { id } = req.params;
    const { options } = req.mquery;

    const user = await userService.fetchUserById(id, options);

    res.jsend.success({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/users/{id}
 */
export const patchUsersById = async (req: Request, res: Response , next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.mongo);

    const { id } = req.params;
    const {
      username,
      email,
      password,
      name,
    } = req.body;

    await userService.updateUserById(id, {
      username,
      email,
      password,
      name,
    });

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/users/{id}
 */
export const deleteUsersById = async (req: Request, res: Response , next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.mongo);
    const noteService = new NoteService(req.logger, req.mongo);

    const { id } = req.params;

    await userService.deleteUserById(id);
    await noteService.deleteUserNotes(id);

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};
