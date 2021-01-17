import { NextFunction, Request, Response } from 'express';
import { UserService } from '../../../services';

/**
 * PUT /api/v1/user/password
 */
export const putUserPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userService = new UserService();

    const { id: userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    await userService.validatePassword(userId, currentPassword);
    await userService.updateUserById(userId, { password: newPassword });

    res.jsend.success(undefined, 204);
  } catch (error) {
    next(error);
  }
};
