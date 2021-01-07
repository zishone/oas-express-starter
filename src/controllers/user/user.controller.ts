import { NextFunction, Request, Response } from 'express';
import { NoteService, UserService } from '../../services';

/**
 * GET /api/v1/user
 */
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.database);

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
export const patchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.database);

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
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.database);
    const noteService = new NoteService(req.logger, req.database);

    const { id: userId } = req.user;
    const { password } = req.body;

    await userService.deleteUserByIdWithCredentials(userId, password);
    await noteService.deleteNotes({ userId });

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/user/password
 */
export const putUserPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService(req.logger, req.database);

    const { id: userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    await userService.updateUserPasswordById(userId, currentPassword, newPassword);

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};
