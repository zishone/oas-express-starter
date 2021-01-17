import { NextFunction, Request, Response } from 'express';
import { NoteService, UserService } from '../../../services';

/**
 * GET /api/v1/user
 */
export const getUserV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService();

    const { id: userId } = req.user;
    const { options } = req.mquery;

    const { user } = await userService.fetchUserById(userId, options);

    res.jsend.success({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/user
 */
export const patchUserV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService();

    const { id: userId } = req.user;
    const { username, email, name } = req.body;

    await userService.updateUserById(userId, {
      username,
      email,
      name,
    });

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/user
 */
export const deleteUserV1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService();
    const noteService = new NoteService();

    const { id: userId } = req.user;
    const { password } = req.body;

    await userService.validatePassword(userId, password);
    await userService.deleteUserById(userId);
    await noteService.deleteNotes({ userId });

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};
