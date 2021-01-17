import { NextFunction, Request, Response } from 'express';
import { NoteService, UserService } from '../../../services';

/**
 * GET /api/v1/users/{userId}
 */
export const getUsersById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService();

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
    const userService = new UserService();

    const { userId } = req.params;
    const { username, email, password, name } = req.body;

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
export const deleteUsersById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService();
    const noteService = new NoteService();

    const { userId } = req.params;

    await userService.deleteUserById(userId);
    await noteService.deleteNotes({ userId });

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};
