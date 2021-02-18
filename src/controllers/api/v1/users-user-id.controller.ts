import { NextFunction, Request, Response } from 'express';
import { NoteService, UserService } from '../../../services';

/**
 * GET /api/v1/users/{userId}
 */
export const getUsersUserIdV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService();

    const { userId } = req.params;
    const { options } = req.mquery;

    req.info['user.id'] = userId;

    const { user } = await userService.fetchUserById(userId, options);

    res.jsend.success({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/users/{userId}
 */
export const patchUsersUserIdV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService();

    const { userId } = req.params;
    const { username, email, password, name } = req.body;

    req.info['user.id'] = userId;

    await userService.updateUserById(userId, {
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
 * DELETE /api/v1/users/{userId}
 */
export const deleteUsersUserIdV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService();
    const noteService = new NoteService();

    const { userId } = req.params;

    req.info['user.id'] = userId;

    await userService.deleteUserById(userId);
    await noteService.deleteNotes({ userId });

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};
